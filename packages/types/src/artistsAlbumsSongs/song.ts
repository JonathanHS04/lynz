import { SonicProfile } from "./shared/sonicProfile";
import { ExternalLinks } from "./shared/externalLinks";
import { ArtistsPerformance } from "./shared/artistsPerformance";
import { SongReview } from "../reviews/songReview";

export type Song = {
    id: string;
    title: string;
    artist: string;
    artistId: string | null;
    features: { id: string ; name: string }[];
    album: string;
    albumType: string;
    isSingle: boolean;
    albumId: string | null;
    externalLinks: ExternalLinks
    image: string;
    albumImage: string;
    duration: number;
    releaseDate: string;
    genre: string;
    producers: string[];
    rating: number;
    sonicProfile: SonicProfile;
    artistsPerformance: ArtistsPerformance;
    userReviews: SongReview[];
}