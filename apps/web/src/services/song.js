const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getSongData(mbid, type="complete") {
  if (!mbid) return null;

  try {
    if (type == "complete") {
      const response = await fetch(`${apiUrl}/song/${mbid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
      
    } else if (type == "basic") {
      const response = await fetch(`${apiUrl}/song/basic/${mbid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching song data:", error);
    return null;
  }
}