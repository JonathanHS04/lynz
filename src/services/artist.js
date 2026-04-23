export async function getArtistData(mbid) {
  if (!mbid) return null;

  try {
    const response = await fetch(`http://localhost:3001/api/artist/${mbid}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();

  } catch (error) {
    console.error("Error fetching artist data:", error);
    return null;
  }
}