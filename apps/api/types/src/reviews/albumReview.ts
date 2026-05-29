import { Album } from "../artistsAlbumsSongs/album";
import { SongReview, SongReviewShort } from "./songReview";
import { Comment } from "./comment";
import { SonicProfile } from "../artistsAlbumsSongs/shared/sonicProfile";

export type AlbumReview = {
    albumId: string;
    artistId: string;
    artist: string;
    albumName: string,
    duration: number;
    genre: string;
    albumImage: string;
    albumReleaseDate: string;
    rating: number;

    reviewId: string;
    userId: string;
    username: string;
    userImage: string;
    userRating: number;
    date: string;
    likes: number;
    comments: Comment[];
    reviewText: string;
    songsReviews: albumSongReview[];
    userSonicProfile: SonicProfile;
}

type albumSongReview = {
    reviewId: string;
    songName: string;
    songId: string;
    duration: number;
    userRating: number;
    date: string;
    likes: number;
    comments: Comment[];
    reviewText: string;
}

export type AlbumReviewWithLike = AlbumReview & {
    liked: boolean;
}