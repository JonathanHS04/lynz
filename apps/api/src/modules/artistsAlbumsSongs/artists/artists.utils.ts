import {
  Album,
  AlbumArtistRelease,
  Artist,
  ArtistInfo,
  ArtistRatingData,
  ExternalLinks,
} from "@repo/types";
import { getRandomRating, songRatings } from "../../../utils/mockData";
import { Prisma } from "../../../generated/prisma";

const formatReleaseData = (unformatedReleases: any): AlbumArtistRelease[] => {
  let c = 0; // Contador para tus ratings de prueba
  const releases = unformatedReleases
    ?.filter((rg: any) => {
      // Solo queremos álbumes de estudio y EPs
      const isPrimaryValid =
        rg["primary-type"] === "Album" || rg["primary-type"] === "EP";

      // Excluimos compilaciones, directos, remixes y contenido no esencial
      const secondaryTypes = rg["secondary-types"] || [];
      const isGarbage = secondaryTypes.some((type: any) =>
        [
          "Remix",
          "DJ-mix",
          "Compilation",
          "Live",
          "Soundtrack",
          "Spokenword",
        ].includes(type),
      );

      return isPrimaryValid && !isGarbage;
    })
    .map((rg: any) => {
      // Intentamos usar el ID del primer release para asegurar que haya portada en CoverArtArchive
      const preferredReleaseId = rg.releases?.[0]?.id ?? null;
      const releaseAliases =
        rg.releases?.map((release: any) => release.id).filter(Boolean) ?? [];

      // Si el release group tiene releases, usamos el ID del release para la imagen
      const hasReleaseInfo = rg.releases && rg.releases.length > 0;
      const imageUrl = hasReleaseInfo
        ? `https://coverartarchive.org/release/${preferredReleaseId}/front-500`
        : `https://coverartarchive.org/release-group/${rg.id}/front-500`;

      return {
        id: rg.id,
        canonicalReleaseId: preferredReleaseId,
        requestedMbids: releaseAliases,
        name: rg.title,
        releaseDate: rg["first-release-date"]
          ? new Date(rg["first-release-date"])
          : null,
        type: rg["primary-type"] === "Album" ? "Álbum" : "EP",
        image: imageUrl,
        rating: songRatings[c++] || 0,
      };
    })
    .sort(
      (a: any, b: any) =>
        new Date(b.releaseDate || 0).getTime() -
        new Date(a.releaseDate || 0).getTime(),
    );

  return releases;
};

export const getExternalLinks = (relations: any): ExternalLinks => {
  const spotifyLink =
    relations.find((r: any) => r.url?.resource?.includes("spotify.com"))?.url
      ?.resource || null;

  const appleLink =
    relations.find(
      (r: any) =>
        r.url?.resource?.includes("apple.com") ||
        r.url?.resource?.includes("itunes.apple.com"),
    )?.url?.resource || null;
  return { appleMusic: appleLink, spotify: spotifyLink };
};

export const formatArtistInfo = (data: any, image: any) => {
  const externalLinks: ExternalLinks = getExternalLinks(data.relations);
  const formattedReleases = formatReleaseData(data["release-groups"]);

  const artistInfo: ArtistInfo = {
    id: data.id,
    name: data.name,
    country: data.area?.name || null,
    activeSince: data["life-span"]?.begin
      ? new Date(data["life-span"]?.begin)
      : null,

    image: image,
    genres: data.genres?.slice(0, 3).map((g: any) => g.name) || [],
    externalLinks,
    releases: formattedReleases ?? [],
  };
  return artistInfo;
};

export const formatDbToArtistInfo = (dbArtist: any): ArtistInfo => {
  const albumByAlias = new Map<string, any>();

  for (const item of dbArtist.albums ?? []) {
    const album = item.album;
    const aliases = [
      album.id,
      ...(album.requestedMbids?.map((requested: any) => requested.mbid) ?? []),
    ];

    const existing = aliases
      .map((alias) => albumByAlias.get(alias))
      .find(Boolean);
    const existingScore = existing ? getAlbumMetadataScore(existing) : -1;
    const albumScore = getAlbumMetadataScore(album);
    const shouldReplace = !existing || albumScore > existingScore;

    if (shouldReplace) {
      aliases.forEach((alias) => albumByAlias.set(alias, album));
    }
  }

  const uniqueAlbums = Array.from(new Set(albumByAlias.values())).sort(
    (a: any, b: any) =>
      new Date(b.releaseDate || 0).getTime() -
      new Date(a.releaseDate || 0).getTime(),
  );

  return {
    id: dbArtist.id,
    name: dbArtist.name,
    country: dbArtist.country,
    activeSince: dbArtist.activeSince ? new Date(dbArtist.activeSince) : null,
    image: dbArtist.image,

    // 1. Casteamos el array de strings para los géneros
    genres: dbArtist.genres ?? ([] as unknown as string[]),

    // 2. Casteamos el objeto de links externos
    externalLinks: dbArtist.externalLinks as unknown as ExternalLinks,

    // 3. Casteamos el array de lanzamientos (AlbumArtistRelease[])
    // que incluye la info básica del álbum + el rating precalculado
    releases: uniqueAlbums.map((album: any) => ({
      id: album.id,
      canonicalReleaseId: album.canonicalReleaseId,
      requestedMbids: album.requestedMbids?.map((requested: any) => requested.mbid) ?? [],
      name: album.name,
      image: album.image,
      releaseDate: album.releaseDate,
      type: album.type,
      rating: Number(getRandomRating()), // Aquí puedes implementar tu lógica real para obtener el rating
    })),
  };
};

const getAlbumMetadataScore = (album: any) => {
  let score = 0;

  if (album.isComplete) score += 1000;
  if (album.canonicalReleaseId) score += 80;
  if (album.releaseDate) score += 60;
  if (album.image) score += 40;
  if (album.genre) score += 20;
  if (album.externalLinks) score += 20;
  if (album.duration) score += 10;

  return score;
};

export const getArtistUpsert = (
  fullData: ArtistInfo,
): Prisma.artistInfoUpsertArgs => {
  return {
    where: { id: fullData.id },

    update: {
      name: fullData.name,
      country: fullData.country,
      activeSince: fullData.activeSince,
      image: fullData.image,

      genres: fullData.genres ?? Prisma.JsonNull,

      externalLinks: fullData.externalLinks ?? Prisma.JsonNull,

      isComplete: true,
    },

    create: {
      id: fullData.id,
      name: fullData.name,
      country: fullData.country,
      activeSince: fullData.activeSince,
      image: fullData.image,

      genres: fullData.genres ?? Prisma.JsonNull,

      externalLinks: fullData.externalLinks ?? Prisma.JsonNull,

      isComplete: true,
    },
  };
};
