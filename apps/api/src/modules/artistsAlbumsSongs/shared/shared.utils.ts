import { SongArtistMinInfo, ArtistSongRole } from "@repo/types";

export const normalizeArtistRole = (
  role?: string,
): ArtistSongRole => {
  if (!role) return "Main";

  const normalized = role.toLowerCase();

  if (
    normalized.includes("feat") ||
    normalized.includes("featured")
  ) {
    return "Feature";
  }

  if (normalized.includes("producer")) {
    return "Producer";
  }

  if (
    normalized.includes("writer") ||
    normalized.includes("composer") ||
    normalized.includes("lyricist")
  ) {
    return "Writer";
  }

  return "Main";
};

export const getTrackArtists = (
  artistCredit: any,
): SongArtistMinInfo[] => {
  if (!artistCredit || !Array.isArray(artistCredit)) {
    return [];
  }

  return artistCredit
    .map((credit: any, index: number) => {
      const artistData = credit.artist;

      if (!artistData) return null;

      const joinphrase = credit.joinphrase?.toLowerCase() || "";

      const inferredRole =
        joinphrase.includes("feat")
          ? "Feature"
          : index === 0
            ? "Main"
            : "Feature";

      return {
        id: artistData.id,
        name: artistData.name || credit.name,
        role: normalizeArtistRole(inferredRole),
      };
    })
    .filter(
      (artist): artist is SongArtistMinInfo =>
        artist !== null,
    );
};


