const AGENT = 'LynzApp/1.0 (jonathanhillmansanchez@gmail.com)';
const TADB_API_KEY = "123"; // Clave de prueba. Cámbiala por tu clave de Patreon en producción.

import { sonicProfile, rating, artistRankings, songRatings } from "./mockData";

export async function getArtistData(mbid) {
  if (!mbid) return null;

  try {
    // 1. Fetch de MusicBrainz
    const res = await fetch(
      `https://musicbrainz.org/ws/2/artist/${mbid}?inc=release-groups+url-rels+genres&fmt=json`,
      {
        headers: { 'User-Agent': AGENT },
        next: { revalidate: 86400 } // Cache por 24 horas
      }
    );

    if (!res.ok) return null;
    const data = await res.json();

    // 2. Obtener Imagen desde TheAudioDB
    let portraitImage = null;
    try {
      const tadbRes = await fetch(
        `https://www.theaudiodb.com/api/v1/json/${TADB_API_KEY}/artist-mb.php?i=${mbid}`,
        { next: { revalidate: 86400 } }
      );
      const tadbData = await tadbRes.json();
      
      if (tadbData?.artists?.[0]) {
        const artistInfo = tadbData.artists[0];
        // Preferimos Fanart (fondo), si no, el Thumb (cuadrado)
        portraitImage = artistInfo.strArtistFanart || artistInfo.strArtistThumb;
      }
    } catch (e) {
      console.error("Error fetching from TheAudioDB:", e);
    }

    // 3. Extraer links externos (Spotify / Apple Music) de las relaciones de MusicBrainz
    const relations = data.relations || [];
    const spotifyLink = relations.find(r => r.type === 'webdriver' && r.url.resource.includes('spotify'))?.url.resource || null;
    const appleLink = relations.find(r => r.type === 'apple music')?.url.resource || null;

    // 4. Procesar lanzamientos
    // ... dentro de getArtistData ...

// 3. Procesar lanzamientos (Mejorado)
let c = 0; // Contador para tus ratings de prueba
    const releases = data['release-groups']
      ?.filter(rg => {
        // Solo queremos álbumes de estudio y EPs
        const isPrimaryValid = rg['primary-type'] === 'Album' || rg['primary-type'] === 'EP';
        
        // Excluimos compilaciones, directos, remixes y contenido no esencial
        const secondaryTypes = rg['secondary-types'] || [];
        const isGarbage = secondaryTypes.some(type => 
          ['Remix', 'DJ-mix', 'Compilation', 'Live', 'Soundtrack', 'Spokenword'].includes(type)
        );

        return isPrimaryValid && !isGarbage;
      })
      .map(rg => {
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
          year: rg['first-release-date']?.split('-')[0] || "N/A",
          type: rg['primary-type'] === 'Album' ? 'Álbum' : 'EP',
          image: imageUrl,
          rating: songRatings[c++] || 0 
        };
      })
  .sort((a, b) => b.year - a.year) || [];
    return {
      id: data.id,
      name: data.name,
      country: data.area?.name || 'Unknown',
      activeSince: data['life-span']?.begin?.split('-')[0] || 'N/A',
      sonicProfile,
      rating,
      rankings: artistRankings,
      // Fallback si no hay imagen en TheAudioDB
      portrait: portraitImage || 'https://via.placeholder.com/1280x720/121212/FFFFFF?text=No+Artist+Image',
      genres: data.genres?.slice(0, 3).map(g => g.name) || [],
      externalLinks: { appleMusic: appleLink, spotify: spotifyLink },
      releases
    };

  } catch (error) {
    console.error("Error fetching Artist data:", error);
    return null;
  }
}