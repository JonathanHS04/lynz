import { SonicProfile } from "./shared/sonicProfile";
import { ExternalLinks } from "./shared/externalLinks";
import { ArtistsPerformance } from "./shared/artistsPerformance";
import { Ranking } from "./shared/rankings";
import { ShortReview } from "../reviews/shortReview";

export type ArtistSongRole = "Main" | "Feature" | "Producer" | "Writer";

export type SongArtistMinInfo = {
    id: string;
    name: string;
    role: ArtistSongRole;
}

// 🛠️ NUEVO TIPO: Para saber en qué álbumes aparece la canción y en qué posición del tracklist
// Removimos la herencia de SongArtistMinInfo usando tipos puros para evitar que pida un "role" en el álbum
export type SongAlbumReference = {
    id: string; // release-group id
    canonicalReleaseId: string; // selected MusicBrainz release id
    releaseAliases?: string[];
    name: string;
    type: string;        // "Album", "EP", "Single"
    image: string | null;
}

export type Track = {
    id: string;
    name: string;
    artists: SongArtistMinInfo[];
    duration: number;
    rating: number;
    image?: string;
}

export type SongSearch = {
    id: string;
    name: string;
    artistsNames: string; // ListenBrainz solo devuelve un string
    albumName: string | null; // ListenBrainz solo devuelve un string o null
    image: string | null;
    rating: number;
}

export type SongBasicInfo = {
    id: string;
    name: string;
    
    artists: SongArtistMinInfo[];
    
    image: string | null;
    externalLinks: ExternalLinks;
    isComplete?: boolean;
    albums: SongAlbumReference[]; // Aquí usamos el nuevo tipo para referenciar los álbumes sin pedir un "role"
}

export type SongBasicRatingData = {
    rating: number;
    sonicProfile: SonicProfile;
}

export type SongBasic = SongBasicInfo & SongBasicRatingData

export type SongInfo = SongBasicInfo & {
    duration: number;
  
    // 💡 NOTA: En tu archivo anterior tenías releaseDate aquí, si lo vas a usar como DateTime 
    // en tu DB relacional se queda como Date | null.
    releaseDate: Date | null; 
    genre: string | null;
}

export type SongRatingData = SongBasicRatingData & {
    artistsPerformance: ArtistsPerformance;
    userReviews: ShortReview[];
    rankings: Ranking[];
}

export type Song = SongInfo & SongRatingData
