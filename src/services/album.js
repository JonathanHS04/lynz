import { userReviews, rating, songRatings, sonicProfile, rankings } from './mockData';

const AGENT = 'LynzApp/1.0 (jonathanhillmansanchez@gmail.com)';

export async function getAlbumData(mbid) {
  if (!mbid) return null;

  try {
    // 1. Intento como Release (incluyendo url-rels para links externos)
    const mbRes = await fetch(
      `https://musicbrainz.org/ws/2/release/${mbid}?inc=recordings+artist-credits+labels+genres+url-rels&fmt=json`,
      {
        headers: { 'User-Agent': AGENT },
        next: { revalidate: 86400 }
      }
    );

    // 2. Si falla, manejamos la posibilidad de que sea un Release-Group
    if (!mbRes.ok) {
      const rgRes = await fetch(
        `https://musicbrainz.org/ws/2/release-group/${mbid}?inc=releases&fmt=json`,
        { headers: { 'User-Agent': AGENT } }
      );

      if (!rgRes.ok) return null;

      const rgData = await rgRes.json();
      const firstReleaseId = rgData.releases?.[0]?.id;
      
      if (!firstReleaseId) return null;
      return getAlbumData(firstReleaseId); // Recursión con ID de lanzamiento real
    }

    const mbData = await mbRes.json();

    // 3. Extraer Links (Spotify / Apple Music)
    const externalLinks = {
      spotify: mbData.relations?.find(r => r.url.resource.includes('spotify'))?.url.resource || null,
      appleMusic: mbData.relations?.find(r => r.url.resource.includes('apple.com'))?.url.resource || null,
    };

    // 4. Procesar lista de tracks
    let totalMs = 0;
    let trackCounter = 0;

    const allTracks = mbData.media?.flatMap((medium) => 
      medium.tracks?.map((track) => {
        const ms = track.length || 0;
        totalMs += ms;

        // Limpieza de nombres en features
        const cleanFeatures = track['artist-credit']?.slice(1)
          .map(f => f.name)
          .filter(name => name && !["&", "feat.", ","].includes(name)) || [];

        return {
          id: track.recording.id,
          title: track.title,
          duration: ms, // Mandamos los milisegundos directos
          artist: track['artist-credit']?.[0]?.name || mbData['artist-credit']?.[0]?.name,
          features: cleanFeatures,
          rating: songRatings[trackCounter++] || 0
        };
      })
    ) || [];

    // 5. Metadata y formateo básico de strings
    const releaseDate = mbData.date || "N/A";
    const releaseYear = releaseDate.split('-')[0];
    const totalTracks = allTracks.length;
    const albumImage = `https://coverartarchive.org/release/${mbData.id}/front-500`;

    return {
      id: mbData.id,
      title: mbData.title,
      artist: mbData['artist-credit']?.[0]?.name || "Artista Desconocido",
      artistId: mbData['artist-credit']?.[0]?.artist?.id,
      
      // Enviamos los datos para que el front los concatene o use
      releaseYear,
      totalTracks,
      duration: totalMs,
      releaseDate,
      
      // Texto descriptivo ya procesado
      genre: mbData.genres?.slice(0, 2).map(g => g.name).join(' / ') || "Urbano Latino",
      image: albumImage,
      externalLinks,
      
      // Data de tus mocks
      rating: rating, 
      tracks: allTracks,
      userReviews,
      sonicProfile,
      rankings
    };

  } catch (error) {
    console.error("Error fetching Album data:", error);
    return null;
  }
}