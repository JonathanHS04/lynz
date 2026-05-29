const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getArtistData(mbid) {
  if (!mbid) throw new Error("MBID is required");

  const response = await fetch(`${apiUrl}/artist/${mbid}`);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.error || `HTTP error! status: ${response.status}`,
    );
  }

  const data = await response.json();
  return data;
}
