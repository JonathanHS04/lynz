import { ExternalLinks } from "./shared/externalLinks";
import { SonicProfile } from "./shared/sonicProfile";
import { Rankings } from "./shared/rankings";
import { AlbumArtistRelease } from "./album";

// 🛠️ NUEVO TIPO: Info mínima de una canción para mostrar en el perfil del artista
export type ArtistSongRelease = {
    id: string;
    name: string;
    image: string | null;
    duration: number;
    rating: number; // Rating precalculado de la canción para mostrar su popularidad
}

export type ArtistInfo = {
    id: string;
    name: string;
    image: string | null;
    isComplete?: boolean;

    country: string | null;
    externalLinks: ExternalLinks | null;
    activeSince: Date | null;
    genres: string[] | null;

    // 🛠️ RELACIONES ADAPTADAS
    releases: AlbumArtistRelease[]; // Álbumes extraídos vía ArtistOnAlbum
}

export type ArtistRatingData = {
    rating: number;
    sonicProfile: SonicProfile;
    rankings: Rankings;
}

export type Artist = ArtistInfo & ArtistRatingData