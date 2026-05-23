export type Track = {
    id: string;
    title: string;
    duration: number;
    artist: string;
    features: { id: string ; name: string }[];
    rating: number;
    image?: string;
}