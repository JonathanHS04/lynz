import {
  AlbumBasicInfo,
  AlbumBasicRatingData,
  AlbumInfo,
  AlbumRatingData,
} from "@repo/types";
import {
  userReviews,
  sonicProfile,
  rating,
  rankings,
} from "../../../utils/mockData.js";
import { prisma } from "../../../config/prismaClient.js";
import {
  formatDbToAlbumInfo,
  prioritizeRelease,
} from "./albums.utils.js";
import { ArtistRole, Prisma } from "../../../generated/prisma";
import { fetchFromMusicBrainz } from "../shared/musicbrainz.utils.js";
import { enqueueAlbumMergeTask } from "../shared/albumMerge.queue.js";
import { withPgAdvisoryLock } from "../shared/advisoryLock.utils.js";

type AlbumReadType = "complete" | "basic";

type AlbumFetchResult = {
  requestedMbid: string;
  releaseGroupId: string;
  releaseData: any;
  canonicalReleaseId: string;
  aliasReleaseIds: string[];
  releaseGroupPrimaryType?: string | null;
  firstReleaseDate?: string | null;
};

const INFLIGHT_ALBUM_TTL_MS = 10000;
const inflightAlbums = new Map<string, Promise<AlbumFetchResult | null>>();
const albumWriteInflight = new Map<string, Promise<void>>();

const albumInclude = (type: AlbumReadType) => ({
  artists: {
    include: {
      artist: true,
    },
  },
  requestedMbids: true,
  ...(type === "complete"
    ? {
        tracks: {
          orderBy: {
            position: "asc" as const,
          },
          include: {
            song: {
              include: {
                artists: {
                  include: {
                    artist: true,
                  },
                },
              },
            },
          },
        },
      }
    : {}),
});

const uniqueBy = <T>(items: T[], getKey: (item: T) => string) => {
  const map = new Map<string, T>();

  for (const item of items) {
    const key = getKey(item);
    if (key && !map.has(key)) {
      map.set(key, item);
    }
  }

  return Array.from(map.values());
};

const normalizeMbids = (mbids: Array<string | null | undefined>) =>
  Array.from(new Set(mbids.filter((mbid): mbid is string => Boolean(mbid))));

const batchUpdateIncompleteSongs = async (
  tx: Prisma.TransactionClient,
  tracks: Array<{ id: string; name: string; duration?: number | null }>,
) => {
  if (tracks.length === 0) return;

  const rows = tracks.map(
    (track) =>
      Prisma.sql`(${track.id}::text, ${track.name}::text, ${
        track.duration ?? null
      }::integer)`,
  );

  await tx.$executeRaw`
    UPDATE "songInfo" AS s
    SET
      name = v.name,
      duration = v.duration,
      "updatedAt" = now()
    FROM (VALUES ${Prisma.join(rows)}) AS v(id, name, duration)
    WHERE s.id = v.id
      AND s."isComplete" = false
  `;
};

export const batchUpdateTrackPositions = async (
  tx: Prisma.TransactionClient,
  albumId: string,
  tracks: Array<{ songId?: string; id?: string; position?: number | null }>,
) => {
  const withPosition = tracks
    .map((track) => ({
      songId: track.songId ?? track.id,
      position: track.position,
    }))
    .filter(
      (track): track is { songId: string; position: number } =>
        Boolean(track.songId) && track.position !== null && track.position !== undefined,
    );

  if (withPosition.length === 0) return;

  const rows = withPosition.map(
    (track) =>
      Prisma.sql`(${albumId}::text, ${track.songId}::text, ${track.position}::integer)`,
  );

  await tx.$executeRaw`
    UPDATE "Track" AS t
    SET
      position = v.position,
      "updatedAt" = now()
    FROM (VALUES ${Prisma.join(rows)}) AS v(album_id, song_id, position)
    WHERE t."albumId" = v.album_id
      AND t."songId" = v.song_id
  `;
};

const deleteInflightAlbumKeys = (
  keys: Iterable<string>,
  promise: Promise<AlbumFetchResult | null>,
) => {
  for (const key of keys) {
    if (inflightAlbums.get(key) === promise) {
      inflightAlbums.delete(key);
    }
  }
};

const scheduleInflightAlbumCleanup = (
  keys: Iterable<string>,
  promise: Promise<AlbumFetchResult | null>,
) => {
  const keysSnapshot = Array.from(keys);

  setTimeout(() => {
    deleteInflightAlbumKeys(keysSnapshot, promise);
  }, INFLIGHT_ALBUM_TTL_MS);
};

export const syncAlbumReleaseAliases = async (
  tx: Prisma.TransactionClient,
  albumId: string,
  knownReleaseMbids: string[],
) => {
  const aliases = normalizeMbids(knownReleaseMbids).filter(
    (mbid) => mbid !== albumId,
  );

  if (aliases.length === 0) return;

  await tx.albumRequestedMbid.updateMany({
    where: {
      mbid: { in: aliases },
      albumId: { not: albumId },
    },
    data: { albumId },
  });

  await tx.albumRequestedMbid.createMany({
    data: aliases.map((mbid) => ({
      mbid,
      albumId,
    })),
    skipDuplicates: true,
  });
};

const reconcileAlbumAliases = async (
  tx: Prisma.TransactionClient,
  albumId: string,
  knownReleaseMbids: string[],
) => {
  const validAliases = normalizeMbids(knownReleaseMbids).filter(
    (mbid) => mbid !== albumId,
  );

  await tx.albumRequestedMbid.deleteMany({
    where: {
      albumId,
      mbid: { notIn: validAliases },
    },
  });
};

export const searchAlbumInfoInDb = async (
  mbid: string,
  type: AlbumReadType = "complete",
): Promise<AlbumInfo | AlbumBasicInfo | null> => {
  const include = albumInclude(type);

  const albums = await prisma.albumInfo.findMany({
    where: {
      OR: [{ id: mbid }, { requestedMbids: { some: { mbid } } }],
      isComplete: true,
    },
    include,
    take: 2,
  });

  const album =
    albums.find((album) =>
      album.requestedMbids?.some((requested) => requested.mbid === mbid),
    ) ?? albums[0];

  return album ? formatDbToAlbumInfo(album, type) : null;
};

export const addKnownReleaseMbids = async (
  albumId: string,
  knownReleaseMbids: string[],
) => {
  await prisma.$transaction((tx) =>
    syncAlbumReleaseAliases(tx, albumId, knownReleaseMbids),
  );
};

const persistAlbumInfoToDB = async (albumInfo: AlbumInfo) => {
  const knownReleaseMbids = await upsertAlbumCore(albumInfo);

  await prisma.$transaction(
    (tx) => syncAlbumArtists(tx, albumInfo),
    { timeout: 5000 },
  );

  await prisma.$transaction(
    (tx) => syncAlbumTracks(tx, albumInfo),
    { timeout: 10000 },
  );

  enqueueAlbumAliasMerge(albumInfo.id, knownReleaseMbids);
};

const upsertAlbumCore = async (albumInfo: AlbumInfo) =>
  prisma
    .$queryRaw<Array<{ canonicalReleaseId: string | null }>>`
      INSERT INTO "albumInfo" (
        id,
        name,
        image,
        type,
        "canonicalReleaseId",
        duration,
        genre,
        "externalLinks",
        "releaseDate",
        "isComplete",
        "updatedAt"
      )
      VALUES (
        ${albumInfo.id},
        ${albumInfo.name},
        ${albumInfo.image ?? null},
        ${albumInfo.type ?? null},
        ${albumInfo.canonicalReleaseId ?? null},
        ${albumInfo.duration ?? null},
        ${albumInfo.genre ?? null},
        ${albumInfo.externalLinks
          ? JSON.stringify(albumInfo.externalLinks)
          : null}::jsonb,
        ${albumInfo.releaseDate ?? null},
        true,
        now()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        type = EXCLUDED.type,
        genre = EXCLUDED.genre,
        duration = EXCLUDED.duration,
        "releaseDate" = EXCLUDED."releaseDate",
        "externalLinks" = COALESCE(
          EXCLUDED."externalLinks",
          "albumInfo"."externalLinks"
        ),
        "canonicalReleaseId" = COALESCE(
          "albumInfo"."canonicalReleaseId",
          EXCLUDED."canonicalReleaseId"
        ),
        image = CASE
          WHEN "albumInfo"."canonicalReleaseId" IS NOT NULL
          THEN COALESCE("albumInfo".image, EXCLUDED.image)
          ELSE EXCLUDED.image
        END,
        "isComplete" = true,
        "updatedAt" = now()
      RETURNING "canonicalReleaseId" AS "canonicalReleaseId"
    `
    .then(async ([storedAlbum]) => {
      const knownReleaseMbids = normalizeMbids([
        ...(albumInfo.requestedMbids ?? []),
        albumInfo.canonicalReleaseId,
        storedAlbum?.canonicalReleaseId,
      ]);

      await prisma.$transaction(
        (tx) => syncAlbumReleaseAliases(tx, albumInfo.id, knownReleaseMbids),
        { timeout: 5000 },
      );

      return knownReleaseMbids;
    });

const enqueueAlbumAliasMerge = (
  albumId: string,
  knownReleaseMbids: string[],
) => {
  return enqueueAlbumMergeTask(albumId, () =>
    withPgAdvisoryLock(`album:${albumId}`, async () => {
      await executeAlbumAliasMerge(albumId, knownReleaseMbids);
      await prisma.$transaction(
        (tx) => reconcileAlbumAliases(tx, albumId, knownReleaseMbids),
        { timeout: 5000 },
      );
    }).catch((error) => {
      console.error("Error merging album aliases in background:", error);
    }),
  );
};

export const addAlbumInfoToDB = async (albumInfo: AlbumInfo) => {
  const existing = albumWriteInflight.get(albumInfo.id);
  if (existing) return existing;

  const promise = persistAlbumInfoToDB(albumInfo).finally(() => {
    if (albumWriteInflight.get(albumInfo.id) === promise) {
      albumWriteInflight.delete(albumInfo.id);
    }
  });

  albumWriteInflight.set(albumInfo.id, promise);
  return promise;
};

const executeAlbumAliasMerge = async (
  canonicalAlbumId: string,
  knownReleaseMbids: string[],
) => {
  const aliasIds = normalizeMbids(knownReleaseMbids).filter(
    (mbid) => mbid !== canonicalAlbumId,
  );
  if (aliasIds.length === 0) return;

  const aliasAlbums = await prisma.albumInfo.findMany({
    where: {
      id: { in: aliasIds },
      isComplete: false,
    },
    include: {
      artists: true,
      tracks: true,
      requestedMbids: true,
    },
  });

  if (aliasAlbums.length === 0) return;

  const aliasesToMove = normalizeMbids(
    aliasAlbums.flatMap((album) => [
      album.id,
      ...album.requestedMbids.map((requested) => requested.mbid),
    ]),
  );

  await prisma.$transaction(
    (tx) => syncAlbumReleaseAliases(tx, canonicalAlbumId, aliasesToMove),
    { timeout: 5000 },
  );

  const artistLinks = uniqueBy(
    aliasAlbums.flatMap((album) =>
      album.artists.map((artistOnAlbum) => ({
        artistId: artistOnAlbum.artistId,
        albumId: canonicalAlbumId,
      })),
    ),
    (link) => `${link.artistId}:${link.albumId}`,
  );

  if (artistLinks.length > 0) {
    await prisma.artistOnAlbum.createMany({
      data: artistLinks,
      skipDuplicates: true,
    });
  }

  const trackLinks = uniqueBy(
    aliasAlbums.flatMap((album) =>
      album.tracks.map((track) => ({
        albumId: canonicalAlbumId,
        songId: track.songId,
        position: track.position,
      })),
    ),
    (track) => `${track.albumId}:${track.songId}`,
  );

  if (trackLinks.length > 0) {
    await prisma.$transaction(
      async (tx) => {
        await tx.track.createMany({
          data: trackLinks,
          skipDuplicates: true,
        });
        await batchUpdateTrackPositions(tx, canonicalAlbumId, trackLinks);
      },
      { timeout: 8000 },
    );
  }

  const movedAliasIds = aliasAlbums.map((album) => album.id);

  await prisma.$transaction(
    async (tx) => {
      await tx.artistOnAlbum.deleteMany({
        where: { albumId: { in: movedAliasIds } },
      });

      await tx.track.deleteMany({
        where: { albumId: { in: movedAliasIds } },
      });

      await tx.albumInfo.deleteMany({
        where: {
          id: { in: movedAliasIds },
          isComplete: false,
        },
      });
    },
    { timeout: 5000 },
  );
};

const releaseGroupReleaseIncludes = "releases+media";
const releaseSummaryIncludes = "release-groups";
const releaseDetailIncludes =
  "recordings+artist-credits+labels+genres+url-rels+release-groups";

const fetchReleaseGroupMetadataFromMB = async (mbid: string) => {
  return fetchFromMusicBrainz<any>(`release-group/${mbid}`);
};

const fetchReleaseGroupReleasesFromMB = async (mbid: string) => {
  return fetchFromMusicBrainz<any>(`release-group/${mbid}`, {
    query: { inc: releaseGroupReleaseIncludes },
  });
};

const fetchReleaseSummaryFromMB = async (mbid: string) => {
  return fetchFromMusicBrainz<any>(`release/${mbid}`, {
    query: { inc: releaseSummaryIncludes },
  });
};

const fetchReleaseDetailsFromMB = async (mbid: string) => {
  return fetchFromMusicBrainz<any>(`release/${mbid}`, {
    query: { inc: releaseDetailIncludes },
  });
};

const fetchReleaseGroupFromMB = async (mbid: string) => {
  const [metadata, releasesData] = await Promise.all([
    fetchReleaseGroupMetadataFromMB(mbid),
    fetchReleaseGroupReleasesFromMB(mbid),
  ]);

  if (!metadata && !releasesData) return null;

  return {
    ...(releasesData ?? {}),
    ...(metadata ?? {}),
    releases: releasesData?.releases ?? metadata?.releases ?? [],
  };
};

const getStoredCanonicalReleaseId = async (releaseGroupId: string) => {
  const existingAlbum = await prisma.albumInfo.findUnique({
    where: { id: releaseGroupId },
    select: { canonicalReleaseId: true },
  });

  return existingAlbum?.canonicalReleaseId ?? null;
};

const buildAlbumFetchResultFromReleaseGroup = async (
  releaseGroupData: any,
  requestedMbid: string,
): Promise<AlbumFetchResult | null> => {
  if (!releaseGroupData?.releases?.length) return null;

  const { bestRelease } = prioritizeRelease(releaseGroupData.releases);
  const storedCanonicalReleaseId = await getStoredCanonicalReleaseId(
    releaseGroupData.id,
  );
  const canonicalReleaseId = storedCanonicalReleaseId ?? bestRelease.id;
  const releaseData = await fetchReleaseDetailsFromMB(canonicalReleaseId);

  if (!releaseData) return null;

  return {
    requestedMbid,
    releaseGroupId: releaseGroupData.id,
    releaseData,
    canonicalReleaseId,
    aliasReleaseIds: releaseGroupData.releases
      .map((release: any) => release.id)
      .filter((id: string) => id !== canonicalReleaseId),
    releaseGroupPrimaryType: releaseGroupData["primary-type"] ?? null,
    firstReleaseDate: releaseGroupData["first-release-date"] ?? null,
  };
};

const fetchAlbumDataFromMB = async (
  mbid: string,
): Promise<AlbumFetchResult | null> => {
  const releaseGroupData = await fetchReleaseGroupFromMB(mbid);

  if (releaseGroupData) {
    return buildAlbumFetchResultFromReleaseGroup(releaseGroupData, mbid);
  }

  const releaseSummary = await fetchReleaseSummaryFromMB(mbid);
  const releaseGroupId = releaseSummary?.["release-group"]?.id;

  if (!releaseGroupId) return null;

  const resolvedReleaseGroupData = await fetchReleaseGroupFromMB(releaseGroupId);

  if (!resolvedReleaseGroupData) return null;

  return buildAlbumFetchResultFromReleaseGroup(resolvedReleaseGroupData, mbid);
};

export const fetchAlbumData = async (
  mbid: string,
): Promise<AlbumFetchResult | null> => {
  const existing = inflightAlbums.get(mbid);
  if (existing) return existing;

  const inflightKeys = new Set([mbid]);
  let promise: Promise<AlbumFetchResult | null>;

  promise = fetchAlbumDataFromMB(mbid)
    .then((result) => {
      if (result) {
        [
          result.releaseGroupId,
          result.canonicalReleaseId,
          ...result.aliasReleaseIds,
        ].forEach((key) => {
          inflightKeys.add(key);
          inflightAlbums.set(key, promise);
        });
      }

      scheduleInflightAlbumCleanup(inflightKeys, promise);

      return result;
    })
    .catch((error) => {
      deleteInflightAlbumKeys(inflightKeys, promise);

      throw error;
    });

  inflightAlbums.set(mbid, promise);
  return promise;
};

export const getAlbumRatingData = (
  mbid: string,
  type: AlbumReadType = "complete",
): AlbumBasicRatingData | AlbumRatingData => {
  const albumBasicRatingData: AlbumBasicRatingData = {
    rating,
    sonicProfile,
  };
  if (type === "basic") return albumBasicRatingData;

  const albumCompleteRatingData: AlbumRatingData = {
    ...albumBasicRatingData,
    userReviews,
    rankings,
  };
  return albumCompleteRatingData;
};

export const syncAlbumArtists = async (
  tx: Prisma.TransactionClient,
  albumInfo: AlbumInfo,
) => {
  const artists = uniqueBy(albumInfo.artists, (artist) => artist.id);

  if (artists.length === 0) return;

  await tx.artistInfo.createMany({
    data: artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
      isComplete: false,
    })),
    skipDuplicates: true,
  });

  await tx.artistOnAlbum.createMany({
    data: artists.map((artist) => ({
      artistId: artist.id,
      albumId: albumInfo.id,
    })),
    skipDuplicates: true,
  });
};

const normalizeArtistRoleForPrisma = (role?: string | null): ArtistRole => {
  if (role && Object.values(ArtistRole).includes(role as ArtistRole)) {
    return role as ArtistRole;
  }

  return ArtistRole.Main;
};

export const syncAlbumTracks = async (
  tx: Prisma.TransactionClient,
  albumInfo: AlbumInfo,
) => {
  const tracks = albumInfo.tracks.filter((track) => track.id);
  const uniqueTracks = uniqueBy(tracks, (track) => track.id);
  const uniqueArtists = uniqueBy(
    tracks.flatMap((track) => track.artists),
    (artist) => artist.id,
  );

  if (uniqueArtists.length > 0) {
    await tx.artistInfo.createMany({
      data: uniqueArtists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        isComplete: false,
      })),
      skipDuplicates: true,
    });
  }

  if (uniqueTracks.length > 0) {
    await tx.songInfo.createMany({
      data: uniqueTracks.map((track) => ({
        id: track.id,
        name: track.name,
        duration: track.duration,
        isComplete: false,
      })),
      skipDuplicates: true,
    });

    await batchUpdateIncompleteSongs(tx, uniqueTracks);
  }

  if (tracks.length > 0) {
    await tx.track.createMany({
      data: tracks.map((track) => ({
        albumId: albumInfo.id,
        songId: track.id,
        position: track.position,
      })),
      skipDuplicates: true,
    });

    await batchUpdateTrackPositions(tx, albumInfo.id, tracks);
  }

  const artistOnSongRows = uniqueBy(
    tracks.flatMap((track) =>
      track.artists.map((artist) => ({
        artistId: artist.id,
        songId: track.id,
        role: normalizeArtistRoleForPrisma(artist.role),
      })),
    ),
    (relation) => `${relation.artistId}:${relation.songId}:${relation.role}`,
  );

  if (artistOnSongRows.length > 0) {
    await tx.artistOnSong.createMany({
      data: artistOnSongRows,
      skipDuplicates: true,
    });
  }
};
