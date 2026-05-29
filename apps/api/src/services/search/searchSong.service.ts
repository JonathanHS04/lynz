import dotenv from "dotenv";
import { getRandomRating } from "../../utils/mockData.js";
import { SongSearch } from "@repo/types";

dotenv.config();

export async function searchSongs(query: string): Promise<SongSearch[]> {
  if (!query || query.length < 2) return [];

  try {
    const encodedQuery = encodeURIComponent(query);

    const url = `https://labs.api.listenbrainz.org/recording-search/json?query=${encodedQuery}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    // Verificamos que realmente sea array
    if (!Array.isArray(data)) return [];

    const songs: SongSearch[] = data.map((rec: any) => ({
      id: rec.recording_mbid,
      name: rec.recording_name,
      artistsNames: rec.artist_credit_name, // lo conviertes en array
      albumName: rec.release_name,

      image: rec.release_mbid
        ? `https://coverartarchive.org/release/${rec.release_mbid}/front-250`
        : null,

      rating: Number(getRandomRating()),
    }));

    return songs;
  } catch (error) {
    console.error("Error en searchSongs:", error);
    return [];
  }
}