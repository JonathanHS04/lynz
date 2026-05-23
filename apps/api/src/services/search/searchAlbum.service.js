import dotenv from 'dotenv'; 
import { getRandomRating } from '../../utils/mockData';
dotenv.config();

const AGENT = process.env.AGENT;

export async function searchAlbums(query, type = 'album') {
    if (!query || query.length < 2) return [];

    try {
        // 1. Buscamos RELEASES (ediciones) en lugar de release-groups 
        // para poder obtener IDs compatibles con Cover Art Archive
        const luceneQuery = encodeURIComponent(`release:"${query}" AND status:official`);
        
        const response = await fetch(
            `https://musicbrainz.org/ws/2/release?query=${luceneQuery}&limit=100&fmt=json&inc=artist-credits+release-groups`,
            { headers: { 'User-Agent': AGENT } }
        );
        const data = await response.json();

        if (!data.releases) return [];

        const albumsMap = new Map();

        // 2. Procesamiento y Normalización
        data.releases.forEach(rel => {
            const rg = rel['release-group'];
            if (!rg) return;

            const rgId = rg.id;
            const primaryType = rg['primary-type']?.toLowerCase();
            const secondaryTypes = rg['secondary-types']?.map(t => t.toLowerCase()) || [];
            const title = rel.title;

            // --- FILTROS DE CALIDAD ---
            const isTrash = /tribute|karaoke|instrumental|audiobook|various artists/i.test(title) || 
                            secondaryTypes.includes('compilation');
            
            if (isTrash) return;

            // Filtro por tipo (Album o EP)
            if (type === 'album' && primaryType !== 'album') return;
            if (type === 'ep' && primaryType !== 'ep') return;

            // --- DEDUPLICACIÓN POR RELEASE-GROUP ---
            // Si el álbum (RG) ya está, solo lo actualizamos si esta versión tiene mejor pinta
            if (!albumsMap.has(rgId)) {
                albumsMap.set(rgId, {
                    id: rgId,
                    title: title,
                    artist: rel['artist-credit']?.[0]?.name || "Artista desconocido",
                    year: rel.date?.split('-')[0] || "N/A",
                    type: primaryType,
                    // Usamos el ID del RELEASE para la imagen (no el del release-group)
                    image: `https://coverartarchive.org/release/${rel.id}/front-250`,
                    score: rel.score,
                    rating: Number(getRandomRating())
                });
            } else {
                // Si encontramos una versión con título más corto (ej. sin "Deluxe"), la preferimos
                const existing = albumsMap.get(rgId);
                if (title.length < existing.title.length) {
                    albumsMap.set(rgId, { ...existing, title: title, image: `https://coverartarchive.org/release/${rel.id}/front-250` });
                }
            }
        });

        // 3. Convertir Map a Array y ordenar por Score
        const results = Array.from(albumsMap.values())
            .sort((a, b) => b.score - a.score)

        return results;

    } catch (error) {
        console.error("Error en searchAlbums:", error);
        return [];
    }
}