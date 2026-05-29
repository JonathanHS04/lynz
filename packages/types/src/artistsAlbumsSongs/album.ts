import { SonicProfile } from "./shared/sonicProfile";
import { ExternalLinks } from "./shared/externalLinks";
import { ShortReview } from "../reviews/shortReview";
import { Rankings } from "./shared/rankings";
import { AlbumTrack } from "./shared/albumTrack";

export type AlbumType = "Album" | "EP" | "Single";

export type AlbumArtistMinInfo = {
  id: string;
  name: string;
};

export type AlbumArtistReleaseInfo = AlbumArtistMinInfo & {
  canonicalReleaseId?: string | null;
  requestedMbids?: string[];
  image: string | null;
  type: string;
  releaseDate?: Date | null;
};

export type AlbumArtistRelease = AlbumArtistReleaseInfo & {
  rating: number;
};

export type AlbumBasicInfo = Omit<AlbumArtistReleaseInfo, "name"> & {
  requestedMbids?: string[];
  canonicalReleaseId?: string | null;
  name: string;
  artists: AlbumArtistMinInfo[];
  externalLinks: ExternalLinks;
  isComplete?: boolean;
};

export type AlbumBasicRatingData = {
  sonicProfile: SonicProfile;
  rating: number;
};

export type AlbumBasic = AlbumBasicInfo & AlbumBasicRatingData;

export type AlbumInfo = AlbumBasicInfo & {
  duration: number;
  releaseDate: Date | null;
  genre: string | null;
  tracks: AlbumTrack[];
};

export type AlbumRatingData = AlbumBasicRatingData & {
  userReviews: ShortReview[];
  rankings: Rankings;
};

export type Album = AlbumInfo & AlbumRatingData;
