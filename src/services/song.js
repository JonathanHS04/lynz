// services/song.js
import {
  userReviews,
  artistPerformance,
  sonicProfile,
  rating,
} from "./mockData";

const AGENT = "LynzApp/1.0 (jonathanhillmansanchez@gmail.com)";

export async function getTrackData(mbid) {
  if (!mbid) return null;

  try {
    // Añadimos url-rels para los links de plataformas
    const mbRes = await fetch(
      `https://musicbrainz.org/ws/2/recording/${mbid}?inc=artist-credits+releases+tags+artist-rels+release-groups+url-rels&fmt=json`,
      {
        headers: { "User-Agent": AGENT },
        next: { revalidate: 86400 },
      },
    );

    if (!mbRes.ok) return null;
    const mbData = await mbRes.json();

    // 1. Lógica para priorizar ÁLBUM sobre SINGLE
    // Buscamos un release que sea 'Album' o 'EP'. Si no hay, tomamos el primero (Single).
    const priorityRelease =
      mbData.releases?.find((rel) => {
        const pType = rel["release-group"]?.["primary-type"];
        return pType === "Album" || pType === "EP";
      }) || mbData.releases?.[0];

    const releaseId = priorityRelease?.id;
    const releaseType =
      priorityRelease?.["release-group"]?.["primary-type"] || "Unknown";
    const isSingle = releaseType.toLowerCase() === "single";

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
    const albumDisplayName = isSingle
      ? "Sencillo"
      : priorityRelease?.title || "Single";

    return {
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
      isSingle: isSingle,
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
      artistPerformance: artistPerformance,
      userReviews: userReviews,
    };
  } catch (error) {
    console.error("Error fetching MusicBrainz data:", error);
    return null;
  }
}
