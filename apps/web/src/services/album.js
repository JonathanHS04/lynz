const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getAlbumData(mbid, type="complete") {
  if (!mbid) return null;
  try {
    if (type == "complete") {
      const response = await fetch(`${apiUrl}/album/${mbid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
      
    } else if (type == "basic") {
      const response = await fetch(`${apiUrl}/album/basic/${mbid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching album data:", error);
    return null;
  }
}