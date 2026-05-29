import {
  AlbumBasicInfo,
  AlbumInfo,
  AlbumTrack,
  ExternalLinks,
  AlbumArtistMinInfo,
  SongArtistMinInfo,
} from "@repo/types";
import { songRatings } from "../../../utils/mockData";
import { getTrackArtists } from "../shared/shared.utils";

type FormatAlbumInfoInput = {
  releaseData: any;
  releaseGroupId: string;
  requestedMbid: string;
  canonicalReleaseId: string;
  aliasReleaseIds: string[];
  releaseGroupPrimaryType?: string | null;
  firstReleaseDate?: string | null;
};

type MBRelease = {
  id: string;
  status?: string | null;
  country?: string | null;
  date?: string | null;
  media?: {
    trackCount?: number | null;
    format?: string | null;
  }[];
};

type PrioritizeReleaseResult = {
  bestRelease: MBRelease;
  aliasReleaseIds: string[];
};

const getAlbumArtists = (artistCredit: any): AlbumArtistMinInfo[] => {
  if (!artistCredit || !Array.isArray(artistCredit)) return [];

  return artistCredit
    .map((credit: any) => {
      const artistData = credit.artist;

      if (!artistData) return null;

      return {
        id: artistData.id,
        name: artistData.name || credit.name,
      };
    })
    .filter((artist): artist is AlbumArtistMinInfo => artist !== null);
};

const uniqueStrings = (values: Array<string | null | undefined>) =>
  Array.from(new Set(values.filter((value): value is string => Boolean(value))));

const buildKnownReleaseMbids = ({
  requestedMbid,
  canonicalReleaseId,
  aliasReleaseIds,
}: Pick<
  FormatAlbumInfoInput,
  "requestedMbid" | "canonicalReleaseId" | "aliasReleaseIds"
>) => uniqueStrings([requestedMbid, canonicalReleaseId, ...aliasReleaseIds]);

export const getAlbumCoverArtUrl = (canonicalReleaseId?: string | null) =>
  canonicalReleaseId
    ? `https://coverartarchive.org/release/${canonicalReleaseId}/front-500`
    : null;

const mapReleaseGroupType = (rawType?: string | null) => {
  switch (rawType) {
    case "Album":
      return "Álbum";
    case "EP":
      return "EP";
    case "Single":
      return "Single";
    default:
      return rawType || "Álbum";
  }
};

export const formatAlbumInfo = (
  albumSource: FormatAlbumInfoInput,
  type: "complete" | "basic" = "complete",
): AlbumInfo | AlbumBasicInfo => {
  const {
    releaseData: mbData,
    releaseGroupId,
    requestedMbid,
    canonicalReleaseId,
    aliasReleaseIds,
    releaseGroupPrimaryType,
    firstReleaseDate,
  } = albumSource;
  const { allTracks, totalMs }: { allTracks: AlbumTrack[]; totalMs: number } =
    formatAlbumSongs(mbData);
  const rawType =
    releaseGroupPrimaryType || mbData["release-group"]?.["primary-type"];
  const externalLinks = {
    spotify:
      mbData.relations?.find((r: any) => r.url?.resource?.includes("spotify"))
        ?.url.resource || null,
    appleMusic:
      mbData.relations?.find((r: any) => r.url?.resource?.includes("apple.com"))
        ?.url.resource || null,
  };
  const artists: AlbumArtistMinInfo[] = getAlbumArtists(
    mbData["artist-credit"],
  );

  const albumBasicInfo: AlbumBasicInfo = {
    id: releaseGroupId,
    canonicalReleaseId,
    requestedMbids: buildKnownReleaseMbids({
      requestedMbid,
      canonicalReleaseId,
      aliasReleaseIds,
    }),
    name: mbData.title,
    artists,
    type: mapReleaseGroupType(rawType),
    image: getAlbumCoverArtUrl(canonicalReleaseId),
    externalLinks,
  };

  if (type === "basic") return albumBasicInfo;

  const albumCompleteInfo: AlbumInfo = {
    ...albumBasicInfo,
    duration: totalMs,
    releaseDate: firstReleaseDate
      ? new Date(firstReleaseDate)
      : mbData.date
        ? new Date(mbData.date)
        : null,
    genre:
      mbData.genres
        ?.slice(0, 2)
        .map((g: any) => g.name)
        .join(" / ") || "Urbano Latino",
    tracks: allTracks,
  };

  return albumCompleteInfo;
};

const formatAlbumSongs = (mbData: any) => {
  let totalMs = 0;
  let trackCounter = 0;

  const allTracks: AlbumTrack[] =
    mbData.media?.flatMap((medium: any) =>
      medium.tracks?.map((track: any) => {
        const ms = track.recording?.length ?? track.length ?? 0;
        totalMs += ms;

        const trackArtists: SongArtistMinInfo[] = getTrackArtists(
          track["artist-credit"] || mbData["artist-credit"],
        );

        trackCounter++;

        const formattedTrack: AlbumTrack = {
          id: track.recording.id,
          name: track.title,
          duration: ms,
          artists: trackArtists,
          rating: songRatings[trackCounter - 1] || 0,
          position: trackCounter,
        };

        return formattedTrack;
      }),
    ) || [];

  return { allTracks, totalMs, trackCounter };
};

export const formatDbToAlbumInfo = (
  dbAlbum: any,
  type: "complete" | "basic" = "complete",
): AlbumBasicInfo | AlbumInfo => {
  const baseAlbumInfo: AlbumBasicInfo = {
    id: dbAlbum.id,
    canonicalReleaseId: dbAlbum.canonicalReleaseId,
    requestedMbids: dbAlbum.requestedMbids?.map((rm: any) => rm.mbid) || [],
    name: dbAlbum.name,
    artists: dbAlbum.artists.map((artistOnAlbum: any) => ({
      id: artistOnAlbum.artist.id,
      name: artistOnAlbum.artist.name,
    })),
    image: dbAlbum.image,
    releaseDate: dbAlbum.releaseDate ? new Date(dbAlbum.releaseDate) : null,
    type: dbAlbum.type || "Álbum",
    externalLinks: dbAlbum.externalLinks as unknown as ExternalLinks,
  };

  if (type === "basic") {
    return baseAlbumInfo;
  }

  const completeAlbumInfo: AlbumInfo = {
    ...baseAlbumInfo,
    duration: dbAlbum.duration,
    releaseDate: dbAlbum.releaseDate ? new Date(dbAlbum.releaseDate) : null,
    genre: dbAlbum.genre,
    tracks: mapPrismaTrackToAlbumTrack(dbAlbum.tracks),
  };

  return completeAlbumInfo;
};

const mapPrismaTrackToAlbumTrack = (tracks: any): AlbumTrack[] => {
  return tracks.map((track: any) => ({
    id: track.song.id,
    name: track.song.name,
    duration: track.song.duration,
    position: track.position,

    artists: track.song.artists.map((artistOnSong: any) => ({
      id: artistOnSong.artist.id,
      name: artistOnSong.artist.name,
      role: artistOnSong.role || "Main",
    })),

    rating: track.position ? songRatings[track.position - 1] || 0 : 0,
  }));
};

export const prioritizeRelease = (
  releases: MBRelease[],
): PrioritizeReleaseResult => {
  const scoredReleases = releases.map((release) => {
    let score = 0;

    if (release.status === "Official") {
      score += 100;
    }

    const preferredCountries = ["XW", "US", "GB"];

    if (release.country && preferredCountries.includes(release.country)) {
      score += 30;
    }

    const formats = release.media?.map((m) => m.format) || [];

    if (formats.includes("Digital Media")) {
      score += 25;
    }

    if (formats.includes("CD")) {
      score += 15;
    }

    const totalTracks =
      release.media?.reduce(
        (acc, media) => acc + (media.trackCount || 0),
        0,
      ) || 0;

    score += totalTracks;

    if (release.date) {
      const year = Number(release.date.slice(0, 4));

      if (!isNaN(year)) {
        score += Math.max(0, 2050 - year) * 0.01;
      }
    }

    return {
      release,
      score,
    };
  });

  scoredReleases.sort((a, b) => b.score - a.score);

  const bestRelease = scoredReleases[0]?.release;

  if (!bestRelease) {
    throw new Error("No valid release found during prioritization");
  }

  const aliasReleaseIds = scoredReleases.slice(1).map((r) => r.release.id);

  return {
    bestRelease,
    aliasReleaseIds,
  };
};
