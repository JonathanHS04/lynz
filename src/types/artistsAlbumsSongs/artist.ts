import { ExternalLinks } from "./shared/externalLinks";
import { SonicProfile } from "./shared/sonicProfile";
import { Rankings } from "./shared/rankings";
import { Album } from "./album";

export type Artist = {
    id: string;
    name: string;
    country: string;
    activeSince: string;
    sonicProfile: SonicProfile;
    rating: number;
    rankings: Rankings;
    portrait: string;
    genres: string[];
    externalLinks: ExternalLinks;
    releases: Album[];
}