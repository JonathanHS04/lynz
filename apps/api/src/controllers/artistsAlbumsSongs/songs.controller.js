import dotenv from "dotenv";
import {
  userReviews,
  artistPerformance,
  sonicProfile,
  rating,
  getMockArtistPerformance,
} from "../../utils/mockData.js";
import { searchSongInCache, addSongToCache } from "../../utils/cache.js";

dotenv.config();

const AGENT = process.env.AGENT;
const TADB_API_KEY = process.env.THE_AUDIO_DB_API_KEY;

const fetchSongData = async (mbid) => {
  const mbRes = await fetch(
    `https://musicbrainz.org/ws/2/recording/${mbid}?inc=artist-credits+releases+tags+artist-rels+release-groups+url-rels&fmt=json`,
    {
      headers: { "User-Agent": AGENT },
    },
  );

  if (!mbRes.ok) return null;

  return await mbRes.json();
};

export const getSongData = async (req, res) => {
  const { mbid } = req.params;
  if (!mbid) return res.status(400).json({ error: "MBID is required" });

  try {
    // Verificar si la canción ya está en la caché
    const cachedSong = await searchSongInCache(mbid);
    if (cachedSong) return res.status(200).json(cachedSong);

    // Añadimos url-rels para los links de plataformas
    const mbData = await fetchSongData(mbid);
    if (!mbData) return res.status(404).json({ error: "Song not found" });

    // 1. Lógica para priorizar ÁLBUM sobre SINGLE
    // Buscamos un release que sea 'Album' o 'EP'. Si no hay, tomamos el primero (Single).
    // 1. Lógica para filtrar y priorizar el ÁLBUM ORIGINAL
    const priorityRelease =
      mbData.releases?.find((rel) => {
        const rg = rel["release-group"];
        const pType = rg?.["primary-type"];
        const sTypes = rg?.["secondary-types"] || [];

        // Filtro de relevancia (la misma lógica de tus álbumes)
        const isPrimaryValid = pType === "Album" || pType === "EP";
        const isGarbage = sTypes.some((type) =>
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
      mbData.releases?.find(
        (rel) => rel["release-group"]?.["primary-type"] === "Single",
      ) ||
      mbData.releases?.[0]; // Si no hay nada, el primer recurso disponible

    const releaseId = priorityRelease?.id;
    const releaseType =
      priorityRelease?.["release-group"]?.["primary-type"] || "Unknown";

    // 2. Extraer Links (Spotify / Apple Music)
    const externalLinks = {
      spotify:
        mbData.relations?.find((r) => r.url?.resource?.includes("spotify"))?.url
          ?.resource ||
        priorityRelease?.relations?.find((r) =>
          r.url?.resource?.includes("spotify"),
        )?.url?.resource ||
        null,
      appleMusic:
        mbData.relations?.find((r) => r.url?.resource?.includes("apple.com"))
          ?.url?.resource ||
        priorityRelease?.relations?.find((r) =>
          r.url?.resource?.includes("apple.com"),
        )?.url?.resource ||
        null,
    };
    // 3. Manejar la Imagen
    const finalImage = releaseId
      ? `https://coverartarchive.org/release/${releaseId}/front-500`
      : "https://via.placeholder.com/500x500?text=No+Cover";

    // 4. Nombre a mostrar para el álbum
    const albumDisplayName = releaseType.toLowerCase() === "single"
      ? "Sencillo"
      : priorityRelease?.title || "Single";

    const songData = {
      id: mbData.id,
      title: mbData.title,
      artist: mbData["artist-credit"]?.[0]?.name || "Artista Desconocido",
      artistId: mbData["artist-credit"]?.[0]?.artist?.id,
      features:
        mbData["artist-credit"]?.slice(1).map((c) => ({
          id: c.artist?.id,
          name: c.name,
        })) || [],

      // Datos del álbum/single
      album: albumDisplayName,
      albumType: releaseType,
      albumId: releaseId,
      externalLinks, // <-- Nuevos links incluidos

      image: finalImage,
      albumImage: finalImage,

      duration: mbData.length, // Se mantiene en ms para que lo formatees en el front
      releaseDate:
        priorityRelease?.date?.split("-")[0] ||
        mbData["first-release-date"]?.split("-")[0] ||
        "N/A",

      genre:
        mbData.tags?.length > 0
          ? mbData.tags
              .slice(0, 2)
              .map((g) => g.name)
              .join(" / ")
          : "Urbano Latino",

      producers:
        mbData.relations
          ?.filter(
            (rel) => rel.type === "producer" || rel.type === "production",
          )
          .map((rel) => rel.artist.name) || [],

      // MockData integrada
      rating: rating,
      sonicProfile: sonicProfile,
      artistPerformance: getMockArtistPerformance(
        { id: mbData["artist-credit"]?.[0]?.artist?.id, name: mbData["artist-credit"]?.[0]?.name },
        mbData["artist-credit"]?.slice(1).map((c) => ({ id: c.artist?.id, name: c.name })) || []
      ),
      userReviews: userReviews,
    };

    res.status(200).json(songData);

    addSongToCache(mbid, songData);
  } catch (error) {
    console.error("Error fetching MusicBrainz data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export async function getSongBasicInfo(req, res) {
  const { mbid } = req.params;
  if (!mbid) return res.status(400).json({ error: "Song ID is required" });

  const cachedSong = await searchSongInCache(mbid);
  if (cachedSong) {
    return res.status(200).json({
      id: cachedSong.id,
      title: cachedSong.title,
      artist: cachedSong.artist,
      artistId: cachedSong.artistId,
      features: cachedSong.features,
      image: cachedSong.image,
      externalLinks: cachedSong.externalLinks,
      sonicProfile: cachedSong.sonicProfile,
      rating: cachedSong.rating,
    });
  }

  try {
    // Incluimos releases y release-groups para identificar si la canción viene en un Álbum o Single
    const response = await fetch(
      `https://musicbrainz.org/ws/2/recording/${mbid}?inc=artist-credits+releases+release-groups+url-rels&fmt=json`,
      {
        headers: { "User-Agent": AGENT },
      },
    );

    if (!response.ok)
      return res.status(500).json({ error: "Internal server error" });
    const data = await response.json();

    const albumRelease = data.releases?.find((rel) => {
      const rg = rel["release-group"];
      const pType = rg?.["primary-type"];
      const sTypes = rg?.["secondary-types"] || [];

      const isPrimaryValid = pType === "Album" || pType === "EP";
      const isGarbage = sTypes.some(type => 
        ['Remix', 'DJ-mix', 'Compilation', 'Live', 'Soundtrack', 'Spokenword'].includes(type)
      );

      return isPrimaryValid && !isGarbage;
    }) || data.releases?.find(rel => rel["release-group"]?.["primary-type"] === "Single") 
       || data.releases?.[0];

    const imageId = albumRelease ? albumRelease.id : data.releases?.[0]?.id;
    const finalImage = imageId
      ? `https://coverartarchive.org/release/${imageId}/front-500`
      : "https://via.placeholder.com/500x500?text=No+Cover";

    return res.status(200).json({
      id: data.id,
      title: data.title,
      artist: data["artist-credit"]?.[0]?.name || "Artista Desconocido",
      artistId: data["artist-credit"]?.[0]?.artist?.id,
      features: data["artist-credit"]?.slice(1).map((c) => ({
        id: c.artist?.id,
        name: c.name,
      })) || [],
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
      rating
    });
  } catch (error) {
    console.error(`Error fetching song info:`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
