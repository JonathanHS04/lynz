import dotenv from 'dotenv'; 
dotenv.config();

const AGENT = process.env.AGENT;
const TADB_API_KEY = process.env.THE_AUDIO_DB_API_KEY;

function calculateScore(itemTitle, query) {
  const normalize = (str) => 
    str.toLowerCase()
       .trim()
       .normalize("NFD")
       .replace(/[\u0300-\u036f]/g, "")
       .replace(/[^\w\s]/gi, '');

  const title = normalize(itemTitle);
  const q = normalize(query);

  // 1. Casos de éxito exacto (Tus reglas originales optimizadas)
  if (title === q) return 100;
  if (title.startsWith(q)) return 85;
  if (title.includes(q)) return 70;

  // 2. Cálculo de Similitud (Levenshtein)
  // Calculamos qué tan diferentes son
  const distance = levenshteinDistance(title, q);
  const maxLength = Math.max(title.length, q.length);
  
  // Convertimos la distancia en un porcentaje de similitud (0 a 100)
  const similarity = ((maxLength - distance) / maxLength) * 100;

  // Solo devolvemos score si la similitud es razonable (ej. > 40%)
  // para evitar ruido de resultados que no tienen nada que ver.
  return similarity > 40 ? Math.round(similarity) : 0;
}

// Implementación eficiente del algoritmo de Levenshtein
function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // sustitución
          matrix[i][j - 1] + 1,     // inserción
          matrix[i - 1][j] + 1      // eliminación
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// 🔴 helper: filtrar álbumes basura
function isValidAlbum(release) {
  if (!release) return false;

  const rg = release['release-group'];

  // Debe existir release-group
  if (!rg?.id) return false;

  // Tipos válidos (evita compilations raras, singles sueltos, etc.)
  const allowedTypes = ['Album', 'EP'];
  if (!allowedTypes.includes(rg['primary-type'])) return false;

  // Evitar cosas sin título útil
  if (!release.title || release.title.length < 2) return false;

  return true;
}

// 🔴 helper: normalizar a album (release-group)
function normalizeAlbum(release) {
  const rg = release['release-group'];

  return {
    id: rg?.id || release.id,
    type: 'album',
    title: rg?.title || release.title,
    subtitle: release['artist-credit']?.[0]?.name || 'Artista',
    image: `https://coverartarchive.org/release/${release.id}/front-250`,
    href: `/Album/${rg?.id || release.id}`
  };
}

export async function searchAll(query) {
  if (!query || query.length < 2) return [];

  try {
    const luceneQuery = encodeURIComponent(
      `recording:"${query}" OR artist:"${query}" OR release:"${query}"`
    );

    const res = await fetch(
      `https://musicbrainz.org/ws/2/recording?query=${luceneQuery}&limit=25&fmt=json&inc=artist-credits+releases+release-groups`,
      { headers: { 'User-Agent': AGENT } }
    );

    if (!res.ok) throw new Error('Error en MusicBrainz');
    const data = await res.json();

    const tempResults = [];
    const artistsMap = new Map();
    const albumsMap = new Map();

    for (const rec of data.recordings || []) {
      const artist = rec['artist-credit']?.[0]?.artist;
      const releases = rec.releases || [];

      // 🎵 SONG
      const song = {
        id: rec.id,
        type: 'song',
        title: rec.title,
        subtitle: artist?.name || 'Artista desconocido',
        image: releases[0] ? `https://coverartarchive.org/release/${releases[0].id}/front-250` : null,
        href: `/Song/${rec.id}`,
        score: calculateScore(rec.title, query)
      };
      tempResults.push(song);

      // 👤 ARTIST
      if (artist?.id && !artistsMap.has(artist.id)) {
        const artistObj = {
          id: artist.id,
          type: 'artist',
          title: artist.name,
          subtitle: 'Artista',
          image: null,
          href: `/Artist/${artist.id}`,
          score: calculateScore(artist.name, query) + 10 // Bonus leve por ser artista
        };
        artistsMap.set(artist.id, artistObj);
        tempResults.push(artistObj);
      }

      // 💿 ALBUMS
      for (const rel of releases) {
        if (!isValidAlbum(rel)) continue;
        const rgId = rel['release-group']?.id;
        if (!rgId || albumsMap.has(rgId)) continue;

        const album = {
          ...normalizeAlbum(rel),
          score: calculateScore(rel.title, query) + 5 // Bonus leve por ser álbum
        };
        albumsMap.set(rgId, album);
        tempResults.push(album);
      }
    }

    // 🔥 DEDUPLICACIÓN FINAL Y ORDENAMIENTO
    // Usamos un Map global para evitar que un ID de canción aparezca como álbum, etc. (opcional)
    // Pero lo más importante es el SORT:
    
    const finalResults = tempResults
      .sort((a, b) => {
        // 1. Prioridad por Score
        if (b.score !== a.score) return b.score - a.score;
        
        // 2. Si el score es igual, priorizamos tipos (Artist > Album > Song)
        const typePriority = { artist: 3, album: 2, song: 1 };
        return typePriority[b.type] - typePriority[a.type];
      })
      .filter((item, index, self) => 
        index === self.findIndex((t) => t.id === item.id && t.type === item.type)
      );

    return finalResults;

  } catch (error) {
    console.error(error);
    return { error: 'Fallo al buscar' };
  }
}

export async function searchAlbums(query) {
  if (!query || query.length < 2) return [];

  try {
    const luceneQuery = encodeURIComponent(`release:"${query}"`);
    const res = await fetch(
      `https://musicbrainz.org/ws/2/release?query=${luceneQuery}&limit=25&fmt=json&inc=artist-credits+release-groups`,
      { headers: { 'User-Agent': AGENT } }
    );
    if (!res.ok) throw new Error('Error en MusicBrainz');
    const data = await res.json();
    return data.releases || [];
  } catch (error) {
    console.error(error);
    return { error: 'Fallo al buscar' };
  }

}