import dotenv from "dotenv";
import { getRandomRating } from "../../utils/mockData.js";

dotenv.config();

const AGENT = process.env.AGENT;

export async function searchSongs(query) {
  if (!query || query.length < 2) return [];

  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://musicbrainz.org/ws/2/recording?query=${encodedQuery}&limit=200&fmt=json&inc=artist-credits+releases+release-groups`;
    const response = await fetch(url, { headers: { "User-Agent": AGENT } });
    const data = await response.json();
    if (!data.recordings) return [];

    const uniqueSongs = new Map();

    data.recordings.forEach((rec) => {
      const title = rec.title;
      const credits = rec["artist-credit"] || [];
      const mainArtist =
        credits[0]?.name || credits[0]?.artist?.name || "Artista desconocido";
      const releases = rec.releases || [];

      let bestRel = null;
      let topRank = -5000; // Empezamos muy abajo

      releases.forEach((rel) => {
        let rank = 0;
        const albumArtist = rel["artist-credit"]?.[0]?.name || "N/A";
        const isOwner =
          albumArtist === "N/A" ||
          albumArtist.toLowerCase() === mainArtist.toLowerCase();

        // 1. EL FILTRO DE VERDAD (STATUS)
        // Si es Official le damos un empujón enorme, si es Bootleg o Promo lo hundimos
        if (rel.status === "Official") rank += 2000;
        else if (rel.status === "Bootleg" || rel.status === "Promotion")
          rank -= 1000;

        // 2. FILTRO DE AUTORÍA
        if (isOwner) rank += 1000;
        if (albumArtist === "Various Artists") rank -= 1000;

        // 3. FILTRO DE TIPO DE DISCO
        if (rel["primary-type"] === "Album") rank += 500;
        if (rel["secondary-types"]?.includes("Compilation")) rank -= 800;

        if (rank > topRank) {
          topRank = rank;
          bestRel = rel;
        }
      });

      const songKey = `${title.toLowerCase()}-${mainArtist.toLowerCase()}`;
      const existing = uniqueSongs.get(songKey);

      const songData = {
        id: rec.id,
        title: title,
        artist: mainArtist,
        album: bestRel?.title || "Single",
        // Priorizamos el release-group para la imagen, es MUCHO más fiable
        image: bestRel?.["release-group"]?.id
          ? `https://coverartarchive.org/release-group/${bestRel["release-group"].id}/front-250`
          : bestRel
            ? `https://coverartarchive.org/release/${bestRel.id}/front-250`
            : null,
        year: bestRel?.date?.split("-")[0] || "N/A",
        score: parseInt(rec.score),
        rating: Number(getRandomRating()),
        rank: topRank,
        meta: rec.length ? formatMsToMinutes(rec.length) : "3:30",
      };

      // Solo reemplazamos si el RANK es mayor (o si es igual pero tiene más score de búsqueda)
      if (!existing || songData.rank > existing.rank) {
        uniqueSongs.set(songKey, songData);
      } else if (
        songData.rank === existing.rank &&
        songData.score > existing.score
      ) {
        uniqueSongs.set(songKey, songData);
      }
    });

    return Array.from(uniqueSongs.values()).sort((a, b) => {
      if (b.rank !== a.rank) return b.rank - a.rank;
      return b.score - a.score;
    });
  } catch (error) {
    console.error("Error en searchSongs:", error);
    return [];
  }
}

function formatMsToMinutes(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
