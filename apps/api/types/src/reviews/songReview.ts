import { Song } from "../artistsAlbumsSongs/song";
import { Comment } from "../reviews/comment";

export type SongReview = Song & SongReviewShort;

export type SongReviewShort = {
    id: string;
    name: string;
    duration: number;
    reviewId: string;
    username: string;
    userImage: string;
    rating: number;
    date: string;
    likes: number;
    comments: Comment[];
    reviewText: string;
}

export type SongReviewWithLike = SongReview & {
    liked: boolean;
}