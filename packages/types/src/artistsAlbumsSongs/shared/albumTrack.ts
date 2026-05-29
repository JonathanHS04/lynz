export type AlbumTrackArtist = {
  id: string;
  name: string;
  role: string;
}

export type AlbumTrack = {
  id: string; // song id
  name: string;
  duration: number;

  artists: AlbumTrackArtist[];

  rating: number;
  position: number;
  image?: string;
}