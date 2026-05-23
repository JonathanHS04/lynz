import dotenv from "dotenv";
import { getRandomRating } from "../../utils/mockData";
dotenv.config();

const AGENT = process.env.AGENT;

export async function searchArtists(query) {
    if (!query) return [];

    // Importante: User-Agent descriptivo para evitar bloqueos
    const url = `https://musicbrainz.org/ws/2/artist?query=artist:${encodeURIComponent(query)}&limit=10&fmt=json`;

    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': AGENT }
        });
        const data = await response.json();

        if (!data.artists) return [];
        return data.artists.map(artist => ({
            id: artist.id, // MBID del artista
            name: artist.name,
            type: artist.type || "Person", // Person, Group, Orchestra, etc.
            country: artist.area?.name || "N/A",
            genres: artist.tags?.slice(0, 3).map(t => t.name) || [], // Géneros: "Rap", "Rock", etc.
            score: artist.score,
            rating: getRandomRating(), // Valoración del artista (si está disponible)
            rankings: artist.rankings || [
        { id: 1, title: 'Top Global', rank: '#56' },
        { id: 2, title: 'Top del género', rank: '#4' }
    ],
        })).sort((a, b) => b.score - a.score);

    } catch (error) {
        console.error("Error buscando artista:", error);
        return [];
    }
}