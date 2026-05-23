import { SonicProfile } from "./shared/sonicProfile";
import { ExternalLinks } from "./shared/externalLinks";
import { AlbumReview } from "../reviews/albumReview";
import { Rankings } from "./shared/rankings";
import { Track } from "./shared/track";

export type Album = {
    id: string;
    requestedMbid: string;
    title: string;
    artist: string;
    artistId: string;
    totalTracks: number;
    duration: number;
    releaseDate: string;
    genre: string;
    image: string;
    externalLinks: ExternalLinks;
    rating: number;
    tracks: Track[];
    userReviews: AlbumReview[];
    sonicProfile: SonicProfile;
    rankings: Rankings;
}