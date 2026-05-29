import {
  userReviews,
  artistPerformance,
  sonicProfile,
  rating,
  getMockArtistPerformance,
  rankings,
} from "../../../utils/mockData";
import {
  SongBasicRatingData,
  SongRatingData,
  SongInfo,
  SongBasicInfo,
  ExternalLinks,
  SongArtistMinInfo,
  SongAlbumReference,
} from "@repo/types";
import { formatDbToSongInfo } from "./songs.utils";
import { Prisma } from "../../../generated/prisma";

import { ApiError } from "../../../utils/ApiError";
import { prisma } from "../../../config/prismaClient";
import {
  batchUpdateTrackPositions,
  syncAlbumReleaseAliases,
} from "../albums/albums.service";
import { enqueueAlbumMergeTask } from "../shared/albumMerge.queue";
import { withPgAdvisoryLock } from "../shared/advisoryLock.utils";

const AGENT = process.env.AGENT;
const songWriteInflight = new Map<string, Promise<void>>();

if (!AGENT)
  throw new ApiError(
    "No se pudo acceder a las variables de entorno de agent y tadb",
  );

export const searchSongInfoInDB = async (
  mbid: string,
  type: "complete" | "basic" = "complete",
): Promise<SongInfo | SongBasicInfo | null> => {
  const dbSong = await prisma.songInfo.findUnique({
    where: { id: mbid },
    include: {
      artists: {
        include: {
          artist: true,
        },
      },
      tracks: {
        include: {
          album: true,
        },
      },
    },
  });

  if (!dbSong || !dbSong.isComplete) return null;

  return formatDbToSongInfo(dbSong, type);
};

export const syncSongArtists = async (
  tx: Prisma.TransactionClient,
  songInfo: SongInfo,
) => {
  const artists = uniqueBy(songInfo.artists, (artist) => artist.id);

  if (artists.length > 0) {
    await tx.artistInfo.createMany({
      data: artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        isComplete: false,
      })),
      skipDuplicates: true,
    });
  }

  const artistOnSongRows = uniqueBy(
    songInfo.artists.map((artist) => ({
      artistId: artist.id,
      songId: songInfo.id,
      role: artist.role,
    })),
    (relation) => `${relation.artistId}:${relation.songId}:${relation.role}`,
  );

  if (artistOnSongRows.length > 0) {
    await tx.artistOnSong.createMany({
      data: artistOnSongRows,
      skipDuplicates: true,
    });
  }
};

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

const getAlbumKnownReleaseMbids = (album: SongAlbumReference) =>
  uniqueBy(
    [album.canonicalReleaseId, ...(album.releaseAliases ?? [])]
      .filter((mbid): mbid is string => Boolean(mbid))
      .map((mbid) => ({ mbid })),
    (item) => item.mbid,
  ).map((item) => item.mbid);

const syncSongAlbumShell = async (
  tx: Prisma.TransactionClient,
  album: SongAlbumReference,
) => {
  await tx.$executeRaw`
    INSERT INTO "albumInfo" (
      id,
      name,
      type,
      image,
      "canonicalReleaseId",
      "isComplete",
      "updatedAt"
    )
    VALUES (
      ${album.id},
      ${album.name},
      ${album.type ?? null},
      ${album.image ?? null},
      ${album.canonicalReleaseId ?? null},
      false,
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      "canonicalReleaseId" = COALESCE(
        "albumInfo"."canonicalReleaseId",
        EXCLUDED."canonicalReleaseId"
      ),
      name = CASE
        WHEN NOT "albumInfo"."isComplete" THEN EXCLUDED.name
        ELSE "albumInfo".name
      END,
      type = CASE
        WHEN NOT "albumInfo"."isComplete"
        THEN COALESCE(EXCLUDED.type, "albumInfo".type)
        ELSE "albumInfo".type
      END,
      image = CASE
        WHEN NOT "albumInfo"."isComplete"
        THEN COALESCE(EXCLUDED.image, "albumInfo".image)
        ELSE "albumInfo".image
      END,
      "updatedAt" = CASE
        WHEN NOT "albumInfo"."isComplete"
          OR "albumInfo"."canonicalReleaseId" IS NULL
        THEN now()
        ELSE "albumInfo"."updatedAt"
      END
  `;
};

const mergeLegacyReleaseAlbumShell = async (
  tx: Prisma.TransactionClient,
  album: SongAlbumReference,
) => {
  const releaseGroupId = album.id;
  const canonicalReleaseId = album.canonicalReleaseId;

  if (
    !releaseGroupId ||
    !canonicalReleaseId ||
    releaseGroupId === canonicalReleaseId
  ) {
    return;
  }

  const legacyAlbum = await tx.albumInfo.findUnique({
    where: { id: canonicalReleaseId },
    include: {
      artists: true,
      tracks: true,
      requestedMbids: true,
      ratingData: true,
    },
  });

  const knownReleaseMbids = [
    ...getAlbumKnownReleaseMbids(album),
    ...(legacyAlbum?.requestedMbids.map((requested) => requested.mbid) ?? []),
  ];

  await syncAlbumReleaseAliases(tx, releaseGroupId, knownReleaseMbids);

  if (!legacyAlbum) return;

  const targetAlbum = await tx.albumInfo.findUnique({
    where: { id: releaseGroupId },
    include: {
      ratingData: true,
    },
  });

  if (legacyAlbum.isComplete && targetAlbum && !targetAlbum.isComplete) {
    await tx.albumInfo.update({
      where: { id: releaseGroupId },
      data: {
        name: legacyAlbum.name,
        image: legacyAlbum.image,
        type: legacyAlbum.type,
        externalLinks: legacyAlbum.externalLinks ?? Prisma.JsonNull,
        duration: legacyAlbum.duration,
        releaseDate: legacyAlbum.releaseDate,
        genre: legacyAlbum.genre,
        canonicalReleaseId:
          targetAlbum.canonicalReleaseId ??
          legacyAlbum.canonicalReleaseId ??
          album.canonicalReleaseId,
        isComplete: true,
      },
    });
  }

  if (legacyAlbum.ratingData && !targetAlbum?.ratingData) {
    await tx.albumRatingInfo.create({
      data: {
        id: releaseGroupId,
        rating: legacyAlbum.ratingData.rating,
        sonicProfile: legacyAlbum.ratingData.sonicProfile ?? Prisma.JsonNull,
        userReviews: legacyAlbum.ratingData.userReviews ?? Prisma.JsonNull,
        rankings: legacyAlbum.ratingData.rankings ?? Prisma.JsonNull,
      },
    });
  }

  const artistLinks = uniqueBy(
    legacyAlbum.artists.map((artistOnAlbum) => ({
      artistId: artistOnAlbum.artistId,
      albumId: releaseGroupId,
    })),
    (link) => `${link.artistId}:${link.albumId}`,
  );

  if (artistLinks.length > 0) {
    await tx.artistOnAlbum.createMany({
      data: artistLinks,
      skipDuplicates: true,
    });
  }

  const trackLinks = uniqueBy(
    legacyAlbum.tracks.map((track) => ({
      albumId: releaseGroupId,
      songId: track.songId,
      position: track.position,
    })),
    (track) => `${track.albumId}:${track.songId}`,
  );

  if (trackLinks.length > 0) {
    await tx.track.createMany({
      data: trackLinks,
      skipDuplicates: true,
    });

    await batchUpdateTrackPositions(tx, releaseGroupId, trackLinks);
  }

  await tx.artistOnAlbum.deleteMany({
    where: { albumId: canonicalReleaseId },
  });

  await tx.track.deleteMany({
    where: { albumId: canonicalReleaseId },
  });

  await tx.albumInfo.delete({
    where: { id: canonicalReleaseId },
  });
};

const persistSongInfoToDB = async (songInfo: SongInfo) => {
  const canonicalAlbums = uniqueBy(
    songInfo.albums.filter((album) => album.id && album.canonicalReleaseId),
    (album) => album.id,
  );

  await prisma.$transaction(
    async (tx) => {
      // 1. Crear o actualizar canción
      await tx.songInfo.upsert({
        where: {
          id: songInfo.id,
        },
        update: {
          name: songInfo.name,
          image: songInfo.image,
          externalLinks: songInfo.externalLinks ?? Prisma.JsonNull,
          duration: songInfo.duration,
          releaseDate: songInfo.releaseDate,
          genre: songInfo.genre,
          isComplete: true,
        },
        create: {
          id: songInfo.id,
          name: songInfo.name,
          image: songInfo.image,
          externalLinks: songInfo.externalLinks ?? Prisma.JsonNull,
          duration: songInfo.duration,
          releaseDate: songInfo.releaseDate,
          genre: songInfo.genre,
          isComplete: true,
        },
      });

      // 2. Sincronizar artistas
      await syncSongArtists(tx, songInfo);

      // 3. Crear álbumes por release-group y guardar aliases release -> release-group
      for (const album of canonicalAlbums) {
        await syncSongAlbumShell(tx, album);
        await syncAlbumReleaseAliases(
          tx,
          album.id,
          getAlbumKnownReleaseMbids(album),
        );
      }

      // 4. Crear tracks siempre apuntando al release-group
      for (const album of canonicalAlbums) {
        await tx.track.upsert({
          where: {
            albumId_songId: {
              albumId: album.id,
              songId: songInfo.id,
            },
          },
          update: {},
          create: {
            albumId: album.id,
            songId: songInfo.id,
            position: null,
          },
        });
      }
    },
    { timeout: 10000 },
  );

  for (const album of canonicalAlbums) {
    enqueueLegacyAlbumMerge(album);
  }
};

const enqueueLegacyAlbumMerge = (album: SongAlbumReference) => {
  return enqueueAlbumMergeTask(album.id, () =>
    withPgAdvisoryLock(`album:${album.id}`, () =>
      prisma.$transaction(
        (tx) => mergeLegacyReleaseAlbumShell(tx, album),
        { timeout: 10000 },
      ),
    ).catch((error) => {
      console.error("Error merging legacy release album in background:", error);
    }),
  );
};

export const addSongInfoToDB = async (songInfo: SongInfo) => {
  const existing = songWriteInflight.get(songInfo.id);
  if (existing) return existing;

  const promise = persistSongInfoToDB(songInfo).finally(() => {
    if (songWriteInflight.get(songInfo.id) === promise) {
      songWriteInflight.delete(songInfo.id);
    }
  });

  songWriteInflight.set(songInfo.id, promise);
  return promise;
};

export const fetchSongData = async (
  mbid: string,
  type: "complete" | "basic" = "complete",
) => {
  const querys =
    type === "complete"
      ? "inc=artist-credits+releases+tags+artist-rels+release-groups+url-rels&fmt=json"
      : "inc=artist-credits+releases+release-groups+url-rels&fmt=json";

  const mbRes = await fetch(
    `https://musicbrainz.org/ws/2/recording/${mbid}?${querys}`,
    {
      headers: { "User-Agent": AGENT },
    },
  );

  if (!mbRes.ok) return null;

  return await mbRes.json();
};

export const getSongRatingData = (
  mbid: string,
  artists: SongArtistMinInfo[],
  type: "complete" | "basic" = "complete",
): SongRatingData | SongBasicRatingData => {
  const songBasicRatingData: SongBasicRatingData = {
    rating,
    sonicProfile,
  };
  if (type === "basic") return songBasicRatingData;

  const songRatingData: SongRatingData = {
    ...songBasicRatingData,
    artistsPerformance: getMockArtistPerformance(mbid, artists),
    userReviews,
    rankings,
  };
  return songRatingData;
};
