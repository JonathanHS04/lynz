export type Comment = {
    id: string;
    username: string;
    userImage: string;
    date: string;
    text: string;
    likes: number;
    replies?: Comment[];
}