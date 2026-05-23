import { artistData as mockArtistData } from '@/app/Artist/[artistId]/mockData'

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const buildFallbackArtistData = (artistId) => ({
  ...mockArtistData,
  id: artistId ?? mockArtistData.id ?? 'artist-demo',
  releases: Array.isArray(mockArtistData.releases) ? mockArtistData.releases : [],
  genres: Array.isArray(mockArtistData.genres) ? mockArtistData.genres : [],
  sonicProfile: Array.isArray(mockArtistData.sonicProfile) ? mockArtistData.sonicProfile : [],
  rankings: Array.isArray(mockArtistData.rankings) ? mockArtistData.rankings : [],
  topTracks: Array.isArray(mockArtistData.topTracks) ? mockArtistData.topTracks : [],
})

export async function getArtistData(mbid) {
  if (!mbid) return buildFallbackArtistData(null);

  try {
    const response = await fetch(`${apiUrl}/artist/${mbid}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (!data) {
      return buildFallbackArtistData(mbid)
    }

    return {
      ...buildFallbackArtistData(mbid),
      ...data,
      id: data.id ?? mbid,
      releases: Array.isArray(data.releases) ? data.releases : buildFallbackArtistData(mbid).releases,
      genres: Array.isArray(data.genres) ? data.genres : buildFallbackArtistData(mbid).genres,
      sonicProfile: Array.isArray(data.sonicProfile) ? data.sonicProfile : buildFallbackArtistData(mbid).sonicProfile,
      rankings: Array.isArray(data.rankings) ? data.rankings : buildFallbackArtistData(mbid).rankings,
      topTracks: Array.isArray(data.topTracks) ? data.topTracks : buildFallbackArtistData(mbid).topTracks,
    }

  } catch (error) {
    console.error("Error fetching artist data:", error);
    return buildFallbackArtistData(mbid);
  }
}