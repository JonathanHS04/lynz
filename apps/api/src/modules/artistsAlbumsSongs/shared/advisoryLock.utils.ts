import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const lockPool = new pg.Pool({
  connectionString:
    process.env.DATABASE_LOCK_URL ??
    process.env.DIRECT_URL ??
    process.env.DATABASE_URL,
  max: Number(process.env.DATABASE_LOCK_POOL_MAX ?? 2),
  idleTimeoutMillis: Number(process.env.DATABASE_LOCK_IDLE_TIMEOUT_MS ?? 10000),
  connectionTimeoutMillis: Number(
    process.env.DATABASE_LOCK_CONNECTION_TIMEOUT_MS ?? 10000,
  ),
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const withPgAdvisoryLock = async <T>(
  key: string,
  fn: () => Promise<T>,
  options: { timeoutMs?: number; pollMs?: number } = {},
): Promise<T> => {
  const timeoutMs = options.timeoutMs ?? 30000;
  const pollMs = options.pollMs ?? 100;
  const deadline = Date.now() + timeoutMs;
  let client: pg.PoolClient | null = null;

  while (Date.now() < deadline) {
    const candidate = await lockPool.connect();
    const result = await candidate.query<{ locked: boolean }>(
      "SELECT pg_try_advisory_lock(hashtext($1)::bigint) AS locked",
      [key],
    );

    if (result.rows[0]?.locked) {
      client = candidate;
      break;
    }

    candidate.release();
    await wait(pollMs);
  }

  if (!client) {
    throw new Error(`Timed out waiting for advisory lock: ${key}`);
  }

  try {
    return await fn();
  } finally {
    await client.query("SELECT pg_advisory_unlock(hashtext($1)::bigint)", [
      key,
    ]);
    client.release();
  }
};
