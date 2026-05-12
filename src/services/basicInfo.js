import { sonicProfile, rating } from "./mockData";

const AGENT = 'LynzApp/1.0 (jonathanhillmansanchez@gmail.com)';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getBasicInfo(id, type = 'song') {
  const entity = type === 'song' ? 'recording' : 'release';
  
  // Para song, incluimos 'releases' y 'release-groups' para saber el tipo (Album vs Single)
  const includes = type === 'song' 
    ? '?inc=artist-credits+releases+release-groups+url-rels' 
    : '?inc=artist-credits+url-rels';

  try {
    const res = await fetch(
      `https://musicbrainz.org/ws/2/${entity}/${id}${includes}&fmt=json`,
      {
        headers: { 'User-Agent': AGENT },
        next: { revalidate: 604800 } 
      }
    );

    if (!res.ok) return null;
    const data = await res.json();

    let imageId = null;

    if (type === 'song') {
      // 1. Buscamos el release que NO sea un single (priorizamos Album o EP)
      const albumRelease = data.releases?.find(rel => {
        const type = rel['release-group']?.['primary-type'];
        return type === 'Album' || type === 'EP';
      });

      // 2. Si lo encuentra, usamos ese. Si no, usamos el primero que aparezca (el Single)
      imageId = albumRelease ? albumRelease.id : data.releases?.[0]?.id;
    } else {
      imageId = data.id;
    }

    const finalImage = imageId 
      ? `https://coverartarchive.org/release/${imageId}/front-500`
      : "https://via.placeholder.com/500x500?text=No+Cover";

    // Extraer links (Spotify/Apple)
    const links = {
      spotify: data.relations?.find(r => r.url.resource.includes('spotify'))?.url.resource || null,
      appleMusic: data.relations?.find(r => r.url.resource.includes('apple.com'))?.url.resource || null,
    };

    return {
      id: data.id,
      name: data.title,
      artist: data['artist-credit']?.[0]?.name || "Artista Desconocido",
      artistId: data['artist-credit']?.[0]?.artist?.id,
      image: finalImage,
      externalLinks: links,
      sonicProfile,
      rating
    };
  } catch (error) {
    console.error(`Error fetching basic ${type} info:`, error);
    return null;
  }
}