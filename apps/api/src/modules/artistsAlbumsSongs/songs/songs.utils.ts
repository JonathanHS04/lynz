import {
  AlbumType,
  SongArtistMinInfo,
  SongBasicInfo,
  SongInfo,
} from "@repo/types";
import { ExternalLinks } from "@repo/types";
import { Prisma } from "../../../generated/prisma";

import { getTrackArtists } from "../shared/shared.utils";
import { ApiError } from "../../../utils/ApiError";

const uniqueStrings = (values: Array<string | null | undefined>) =>
  Array.from(new Set(values.filter((value): value is string => Boolean(value))));

export const prioritizeAlbumReleaseOverSingle = (releases: any) => {
  return (
    releases?.find((rel: any) => {
      const rg = rel["release-group"];
      const pType = rg?.["primary-type"];
      const sTypes = rg?.["secondary-types"] || [];

      // Filtro de relevancia (la misma lógica de tus álbumes)
      const isPrimaryValid = pType === "Album" || pType === "EP";
      const isGarbage = sTypes.some((type: any) =>
        [
          "Remix",
          "DJ-mix",
          "Compilation",
          "Live",
          "Soundtrack",
          "Spokenword",
        ].includes(type),
      );

      // Solo aceptamos si es Album/EP y NO es basura
      return isPrimaryValid && !isGarbage;
    }) ||
    releases?.find(
      (rel: any) => rel["release-group"]?.["primary-type"] === "Single",
    ) ||
    releases?.[0]
  ); // Si no hay nada, el primer recurso disponible
};

export const getExternalLinks = (relations: any, release?: any) => ({
  spotify:
    relations?.find((r: any) => r.url?.resource?.includes("spotify"))?.url
      ?.resource ||
    release?.relations?.find((r: any) => r.url?.resource?.includes("spotify"))
      ?.url?.resource ||
    null,
  appleMusic:
    relations?.find((r: any) => r.url?.resource?.includes("apple.com"))?.url
      ?.resource ||
    release?.relations?.find((r: any) => r.url?.resource?.includes("apple.com"))
      ?.url?.resource ||
    null,
});

export const formatSongInfo = (
  mbData: any,
  type: "complete" | "basic" = "complete",
): SongBasicInfo | SongInfo => {
  // 1. Lógica para filtrar y priorizar el ÁLBUM ORIGINAL y ÁLBUM sobre SINGLE
  const priorityRelease =
    prioritizeAlbumReleaseOverSingle(mbData.releases) ?? mbData.releases[0];

  if (!priorityRelease) {
    throw new ApiError(
      "No se encontró ningún release válido para esta canción",
    );
  }
  const releaseGroup = priorityRelease["release-group"];
  const releaseGroupId = releaseGroup?.id;

  if (!releaseGroupId) {
    throw new ApiError(
      "No se encontro release-group para el release de esta cancion",
    );
  }

  const releaseId = priorityRelease.id;
  const rawType = releaseGroup?.["primary-type"];
  const releaseAliases = uniqueStrings(
    mbData.releases
      ?.filter((rel: any) => rel["release-group"]?.id === releaseGroupId)
      .map((rel: any) => rel.id) ?? [],
  );

  const releaseType: AlbumType =
    rawType === "Album" || rawType === "EP" || rawType === "Single"
      ? rawType
      : "Unknown";

  // 2. Extraer Links (Spotify / Apple Music)
  const externalLinks = getExternalLinks(mbData.relations, priorityRelease);
  // 3. Manejar la Imagen
  const finalImage: string | null = releaseId
    ? `https://coverartarchive.org/release/${releaseId}/front-500`
    : "https://via.placeholder.com/500x500?text=No+Cover";
  // 4. Nombre a mostrar para el álbum
  const albumDisplayName = priorityRelease?.title || "Unknown Release";

  const songBasicInfo: SongBasicInfo = {
    id: mbData.id,
    name: mbData.title,
    artists: getTrackArtists(mbData["artist-credit"]),
    externalLinks, // <-- Nuevos links incluidos

    image: finalImage,
    albums: [priorityRelease].map((rel: any) => ({
      id: releaseGroupId,
      canonicalReleaseId: rel.id,
      releaseAliases,
      name: albumDisplayName,
      type: releaseType,
      image: finalImage,
    })),
  };

  if (type === "basic") return songBasicInfo;

  const date = priorityRelease?.date || mbData["first-release-date"];
  const songInfo: SongInfo = {
    ...songBasicInfo,

    duration: mbData.length, // Se mantiene en ms para que lo formatees en el front
    releaseDate: date ? (new Date(date) as Date) : null,
    genre:
      mbData.tags?.length > 0
        ? mbData.tags
            .slice(0, 2)
            .map((g: any) => g.name)
            .join(" / ")
        : null,
  };
  return songInfo;
};

export const formatDbToSongInfo = (
  dbSong: any,
  type: "complete" | "basic" = "complete",
): SongBasicInfo | SongInfo => {
  const baseSongInfo: SongBasicInfo = {
    id: dbSong.id,
    name: dbSong.name,
    artists: getTrackArtists(dbSong.artists),
    image: dbSong.image,
    albums: dbSong.tracks.map((track: any) => ({
      id: track.album.id,
      canonicalReleaseId: track.album.canonicalReleaseId ?? track.album.id,
      name: track.album.name,
      image: track.album.image,
      type: track.album.type,
    })),
    externalLinks: dbSong.externalLinks as unknown as ExternalLinks, // <-- Solución al error
  };

  // 2. Si solo se pidió la info básica, retornamos temprano
  if (type === "basic") {
    return baseSongInfo;
  }

  // 3. Si se pidió completa, extendemos el objeto con la data restante
  const completeSongInfo: SongInfo = {
    ...baseSongInfo,
    duration: dbSong.duration,
    releaseDate: dbSong.releaseDate ? new Date(dbSong.releaseDate) : null,
    genre: dbSong.genre,
  };

  return completeSongInfo;
};
