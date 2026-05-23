const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const SEARCH_LIMITS = {
	artist: 2,
	album: 10,
	song: 20,
};


export async function searchAll(query, searchLimits = SEARCH_LIMITS) {
    const response = await fetch(`${apiUrl}/search?q=${encodeURIComponent(query)}`);
	const results = await response.json();

    // 2. Filtrado por tipo y aplicación de límites
    const artists = results
        .filter(item => item.type === 'artist')
        .slice(0, searchLimits.artist);

    const albums = results
        .filter(item => item.type === 'album')
        
    const songs = results
        .filter(item => item.type === 'song')

	return {
		query: query.trim(),
		artists,
		albums,
		songs,
		totalResults: artists.length + albums.length + songs.length,
	};
}

export const searchAlbums = async (query) => {
    const response = await fetch(`${apiUrl}/search/albums?q=${encodeURIComponent(query)}`);
    const albums = await response.json();
    return albums;
}

export const searchSongs = async (query) => {
    const response = await fetch(`${apiUrl}/search/songs?q=${encodeURIComponent(query)}`);
    const songs = await response.json();
    return songs;
}

export const searchArtists = async (query) => {
    const response = await fetch(`${apiUrl}/search/artists?q=${encodeURIComponent(query)}`);
    const artists = await response.json();
    return artists.slice(0, SEARCH_LIMITS.artist); // Limitar a 2 resultados
}
