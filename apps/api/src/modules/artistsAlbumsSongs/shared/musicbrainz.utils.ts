import { ApiError } from "../../../utils/ApiError";

const MUSICBRAINZ_BASE_URL = "https://musicbrainz.org/ws/2";
const DEFAULT_TIMEOUT_MS = 10000;
const DEFAULT_RETRIES = 2;
const MIN_REQUEST_INTERVAL_MS = 1100;

const AGENT = process.env.AGENT;

if (!AGENT) {
  throw new ApiError("No se pudo acceder a la variable de entorno AGENT");
}

type MusicBrainzFetchOptions = {
  query?: Record<string, string | number | boolean | undefined>;
  retries?: number;
  timeoutMs?: number;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let musicBrainzQueue = Promise.resolve();
let lastMusicBrainzRequestAt = 0;

const waitForMusicBrainzTurn = async () => {
  const nextTurn = musicBrainzQueue.then(async () => {
    const elapsed = Date.now() - lastMusicBrainzRequestAt;

    if (elapsed < MIN_REQUEST_INTERVAL_MS) {
      await wait(MIN_REQUEST_INTERVAL_MS - elapsed);
    }

    lastMusicBrainzRequestAt = Date.now();
  });

  musicBrainzQueue = nextTurn.catch(() => undefined);
  await nextTurn;
};

const getTimeoutSignal = (timeoutMs: number): AbortSignal => {
  const timeout =
    (AbortSignal as typeof AbortSignal & {
      timeout?: (milliseconds: number) => AbortSignal;
    }).timeout;

  if (timeout) return timeout(timeoutMs);

  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
};

const buildMusicBrainzUrl = (
  path: string,
  query: MusicBrainzFetchOptions["query"] = {},
) => {
  const url = new URL(`${MUSICBRAINZ_BASE_URL}/${path}`);

  Object.entries({ ...query, fmt: "json" }).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
};

export const fetchFromMusicBrainz = async <T = any>(
  path: string,
  options: MusicBrainzFetchOptions = {},
): Promise<T | null> => {
  const retries = options.retries ?? DEFAULT_RETRIES;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const url = buildMusicBrainzUrl(path, options.query);
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await waitForMusicBrainzTurn();

      const res = await fetch(url, {
        headers: { "User-Agent": AGENT },
        signal: getTimeoutSignal(timeoutMs),
      });

      if (res.status === 404 || res.status === 400) return null;

      if (res.ok) {
        return (await res.json()) as T;
      }

      lastError = new Error(`MusicBrainz responded with ${res.status}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < retries) {
      await wait(700 * (attempt + 1));
    }
  }

  console.error("MusicBrainz request failed after retries:", {
    path,
    error: lastError,
  });

  throw new ApiError("MusicBrainz no respondió correctamente", 503);
};
