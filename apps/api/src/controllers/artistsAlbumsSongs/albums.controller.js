import dotenv from "dotenv";
import {
  userReviews,
  sonicProfile,
  rating,
  songRatings,
  rankings,
} from "../../utils/mockData.js";
import { searchAlbumInCache, addAlbumToCache } from "../../utils/cache.js";
dotenv.config();

const AGENT = process.env.AGENT;
const TADB_API_KEY = process.env.THE_AUDIO_DB_API_KEY;

const fetchAlbumData = async (mbid, type = "complete") => {
  let includes;
  if (type === "complete") {
    includes = "recordings+artist-credits+labels+genres+url-rels";
  } else if (type === "basic") {
    includes = "artist-credits+url-rels";
  }
  // 1. Intento como Release
  let mbRes = await fetch(
    `https://musicbrainz.org/ws/2/release/${mbid}?inc=${includes}&fmt=json`,
    { headers: { "User-Agent": AGENT } },
  );

  let mbData = null;

  if (mbRes.ok) {
    mbData = await mbRes.json();
  } else {
    // 2. Si falla, intentamos como Release-Group
    const rgRes = await fetch(
      `https://musicbrainz.org/ws/2/release-group/${mbid}?inc=releases&fmt=json`,
      { headers: { "User-Agent": AGENT } },
    );

    if (!rgRes.ok) return null;

    const rgData = await rgRes.json();
    // Filtramos para obtener el primer release que sea Album o EP
    const firstRelease =
      rgData.releases?.find(
        (r) => !r["status"] || r["status"] === "Official",
      ) || rgData.releases?.[0];

    if (!firstRelease) return null;

    // Hacemos la petición final con el ID del Release real
    const finalRes = await fetch(
      `https://musicbrainz.org/ws/2/release/${firstRelease.id}?inc=${includes}&fmt=json`,
      { headers: { "User-Agent": AGENT } },
    );

    if (finalRes.ok) mbData = await finalRes.json();
  }

  return mbData;
};

const formatAlbumSongs = (mbData) => {
  let totalMs = 0;
  let trackCounter = 0;

  const allTracks =
    mbData.media?.flatMap((medium) =>
      medium.tracks?.map((track) => {
        const ms = track.length || 0;
        totalMs += ms;

        // Limpieza de nombres en features
        const cleanFeatures =
          track["artist-credit"]
            ?.slice(1)
            .map((f) => f.name)
            .filter((name) => name && !["&", "feat.", ","].includes(name)) ||
          [];

        return {
          id: track.recording.id,
          title: track.title,
          duration: ms, // Mandamos los milisegundos directos
          artist:
            track["artist-credit"]?.[0]?.name ||
            mbData["artist-credit"]?.[0]?.name,
          features: cleanFeatures,
          rating: songRatings[trackCounter++] || 0,
        };
      }),
    ) || [];

  return { allTracks, totalMs, trackCounter };
};

// ... tus otros imports

export const getAlbumData = async (req, res) => {
  const { mbid } = req.params; // Este es el ID "original" solicitado
  if (!mbid) return res.status(400).json({ error: "MBID is required" });

  try {
    // 1. Check Cache primero
    const cachedAlbum = await searchAlbumInCache(mbid);
    if (cachedAlbum) return res.status(200).json(cachedAlbum);

    // 2. Fetch Data
    const mbData = await fetchAlbumData(mbid);
    if (!mbData) return res.status(404).json({ error: "Album not found" });

    // 3. Procesar links y canciones (tu lógica actual está bien)
    const externalLinks = {
      spotify: mbData.relations?.find((r) => r.url.resource.includes("spotify"))?.url.resource || null,
      appleMusic: mbData.relations?.find((r) => r.url.resource.includes("apple.com"))?.url.resource || null,
    };

    const { allTracks, totalMs } = formatAlbumSongs(mbData);

    // 4. Construir objeto final
    const albumData = {
      id: mbData.id, // ID real del Release
      requestedMbid: mbid, // Guardamos el solicitado para consistencia
      title: mbData.title,
      artist: mbData["artist-credit"]?.[0]?.name || "Artista Desconocido",
      artistId: mbData["artist-credit"]?.[0]?.artist?.id,
      releaseYear: mbData.date?.split("-")[0] || "N/A",
      totalTracks: allTracks.length,
      duration: totalMs,
      releaseDate: mbData.date || "N/A",
      genre: mbData.genres?.slice(0, 2).map((g) => g.name).join(" / ") || "Urbano Latino",
      image: `https://coverartarchive.org/release/${mbData.id}/front-500`,
      externalLinks,
      // Data de mocks
      rating,
      tracks: allTracks,
      userReviews,
      sonicProfile,
      rankings,
    };

    // 5. Responder y Cachear
    res.status(200).json(albumData);

    // IMPORTANTE: Guardar bajo el 'mbid' que el usuario buscó 
    // para que la caché sea efectiva en futuras búsquedas con ese mismo ID.
    addAlbumToCache(mbid, albumData).catch(err => 
      console.error("Error silencioso al cachear:", err)
    );

  } catch (error) {
    console.error("Error fetching Album data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export async function getAlbumBasicInfo(req, res) {
  const { mbid } = req.params;
  if (!mbid) return res.status(400).json({ error: "Album ID is required" });

  try {
    const data = await fetchAlbumData(mbid, "basic");

    const finalImage = data.id
      ? `https://coverartarchive.org/release/${data.id}/front-500`
      : "https://via.placeholder.com/500x500?text=No+Cover";

    return res.status(200).json({
      id: data.id,
      title: data.title,
      artist: data["artist-credit"]?.[0]?.name || "Artista Desconocido",
      artistId: data["artist-credit"]?.[0]?.artist?.id,
      image: finalImage,
      externalLinks: {
        spotify:
          data.relations?.find((r) => r.url.resource.includes("spotify"))?.url
            .resource || null,
        appleMusic:
          data.relations?.find((r) => r.url.resource.includes("apple.com"))?.url
            .resource || null,
      },
      sonicProfile,
      rating,
    });
  } catch (error) {
    console.error(`Error fetching album info:`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
