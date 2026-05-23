import dotenv from "dotenv";
import {
  sonicProfile,
  rating,
  artistRankings,
  songRatings,
} from "../../utils/mockData.js";
import { searchArtistInCache, addArtistToCache } from "../../utils/cache.js";

dotenv.config();

const AGENT = process.env.AGENT;
const TADB_API_KEY = process.env.THE_AUDIO_DB_API_KEY;

const fetchArtistData = async (mbid) => {
  const res = await fetch(
    `https://musicbrainz.org/ws/2/artist/${mbid}?inc=release-groups+url-rels+genres&fmt=json`,
    {
      headers: { "User-Agent": AGENT },
    },
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data;
};

const fecthArtistImage = async (mbid) => {
  let portraitImage = null;
  // Si no tienes API KEY en el .env, usamos la '2' por defecto para pruebas
  const key = TADB_API_KEY || "123"; 
  
  try {
    const tadbRes = await fetch(
      `https://www.theaudiodb.com/api/v1/json/${key}/artist-mb.php?i=${mbid}`
    );    
    
    // TheAudioDB a veces devuelve 200 OK con un body vacío si no encuentra nada
    const tadbData = await tadbRes.json();

    if (tadbData?.artists && tadbData.artists.length > 0) {
      const artistInfo = tadbData.artists[0];
      
      // Para un perfil tipo "Portrait", strArtistThumb es el estándar.
      // strArtistFanart es mejor para fondos de pantalla (Hero sections).
      portraitImage = artistInfo.strArtistThumb || artistInfo.strArtistFanart || null;
      
      // Si la imagen existe, forzamos HTTPS (a veces vienen como HTTP)
      if (portraitImage) {
        portraitImage = portraitImage.replace("http://", "https://");
      }
      console.log("Imagen encontrada en TheAudioDB:", portraitImage);
    }
  } catch (e) {
    console.error("Error fetching from TheAudioDB:", e);
  }
  return portraitImage;
};

const formatReleaseData = (unformatedReleases) => {
  let c = 0; // Contador para tus ratings de prueba
  const releases =
    unformatedReleases
      ?.filter((rg) => {
        // Solo queremos álbumes de estudio y EPs
        const isPrimaryValid =
          rg["primary-type"] === "Album" || rg["primary-type"] === "EP";

        // Excluimos compilaciones, directos, remixes y contenido no esencial
        const secondaryTypes = rg["secondary-types"] || [];
        const isGarbage = secondaryTypes.some((type) =>
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
      .map((rg) => {
        // Intentamos usar el ID del primer release para asegurar que haya portada en CoverArtArchive
        const preferredReleaseId = rg.releases?.[0]?.id || rg.id;

        // Si el release group tiene releases, usamos el ID del release para la imagen
        const hasReleaseInfo = rg.releases && rg.releases.length > 0;
        const imageUrl = hasReleaseInfo
          ? `https://coverartarchive.org/release/${preferredReleaseId}/front-500`
          : `https://coverartarchive.org/release-group/${rg.id}/front-500`;

        return {
          id: rg.id,
          title: rg.title,
          year: rg["first-release-date"]?.split("-")[0] || "N/A",
          type: rg["primary-type"] === "Album" ? "Álbum" : "EP",
          image: imageUrl,
          rating: songRatings[c++] || 0,
        };
      })
      .sort((a, b) => b.year - a.year) || [];

  return releases;
};

export const getArtistData = async (req, res) => {
  const { mbid } = req.params;
  if (!mbid) return res.status(400).json({ error: "Missing mbid parameter" });

  try {
    // Verificar si el artista ya está en la caché
    const cachedArtist = await searchArtistInCache(mbid);
    if (cachedArtist) return res.status(200).json(cachedArtist);

    // 1. Fetch de MusicBrainz
    const data = await fetchArtistData(mbid);
    if (!data) return res.status(404).json({ error: "Artist not found" });

    const formattedReleases = formatReleaseData(data["release-groups"]);

    console.log(
      "Datos del artista obtenidos de MusicBrainz, buscando imagen...",
    );

    const portraitImage = await fecthArtistImage(mbid);

    console.log("Imagen obtenida, preparando respuesta...");
    // 3. Extraer links externos (Spotify / Apple Music) de las relaciones de MusicBrainz
    const relations = data.relations || [];

    const spotifyLink =
      relations.find((r) => r.url?.resource?.includes("spotify.com"))?.url
        ?.resource || null;

    const appleLink =
      relations.find(
        (r) =>
          r.url?.resource?.includes("apple.com") ||
          r.url?.resource?.includes("itunes.apple.com"),
      )?.url?.resource || null;

    const artistData = {
      id: data.id,
      name: data.name,
      country: data.area?.name || "Unknown",
      activeSince: data["life-span"]?.begin?.split("-")[0] || "N/A",
      sonicProfile,
      rating,
      rankings: artistRankings,
      portrait:
        portraitImage ||
        "https://via.placeholder.com/1280x720/121212/FFFFFF?text=No+Artist+Image",
      genres: data.genres?.slice(0, 3).map((g) => g.name) || [],
      externalLinks: { appleMusic: appleLink, spotify: spotifyLink },
      releases: formattedReleases,
    };

    console.log(spotifyLink, appleLink);

    res.status(200).json(artistData);
    addArtistToCache(mbid, artistData, portraitImage); // Guardamos en caché para futuras consultas
  } catch (error) {
    console.error("Error fetching Artist data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
