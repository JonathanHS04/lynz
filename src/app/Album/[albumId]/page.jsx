import React from 'react';
import { getRatingFont } from '@/utils/getRatingStyle';
import { Star } from 'lucide-react';
import Link from 'next/link';
import RatingButton from '@/components/RatingButton';
import InteractiveRating from '@/components/InteractiveRating';
import Tracklist from '@/components/Tracklist';
import RatingAndQuickActions from '@/components/RatingAndQuickActions';
import RankingInfo from '@/components/RankingInfo';
import Profile from '@/components/Profile';
import UserReviewsPanel from '@/components/UserReviewsPanel';
import SonicProfile from '@/components/SonicProfile';


const albumData = {
    title: "POR SI MAÑANA NO ESTOY",
    artist: "Omar Courtz",
    artistId: 1,
    releaseDate: "2026 • 18 canciones • 1 h 10 min",
    genre: "Urbano Latino / Experimental",
    image: "https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg",
    rating: 9.4,
    description: "Tras el éxito de 'PRIMERA MUSA', Omar Courtz redefine su sonido con una propuesta experimental y cinematográfica. Un álbum de 18 tracks que transita entre el trap oscuro, el reggaetón de vanguardia y letras profundamente personales.",
    tracks: [
        { id: 1, artist: "Omar Courtz", title: "OUTRO", duration: "4:01", plays: "3.4M", rating: 8.9, features: [] },
        { id: 2, artist: "Omar Courtz", title: "EL MUNDO SE VA A ACABAR", duration: "3:34", plays: "12M", rating: 9.2, features: ["KARBeats"] },
        { id: 3, artist: "Omar Courtz", title: "FOREVER TU GANTEL", duration: "3:47", plays: "20M", rating: 9.5, features: ["Ñengo Flow"] },
        { id: 4, artist: "Omar Courtz", title: "L a k e n o s h i", duration: "3:28", plays: "9.7M", rating: 8.8, features: [] },
        { id: 5, artist: "Omar Courtz", title: "VAMOaCOCHI", duration: "3:20", plays: "8.1M", rating: 9.0, features: [] },
        { id: 6, artist: "Omar Courtz", title: "SUSU", duration: "3:00", plays: "4M", rating: 8.5, features: [] },
        { id: 7, artist: "Omar Courtz", title: "SIRENA", duration: "3:37", plays: "4.6M", rating: 8.7, features: [] },
        { id: 8, artist: "Omar Courtz", title: "GANTEL y BELLAKz", duration: "3:35", plays: "2.5M", rating: 8.4, features: ["Bassyy"] },
        { id: 9, artist: "Omar Courtz", title: "SI ESTÁS CON ALGUIEN", duration: "4:12", plays: "15M", rating: 9.3, features: [] },
        { id: 10, artist: "Omar Courtz", title: "Dulces SueñoZzz (+INTERLUDIO)", duration: "5:52", plays: "4M", rating: 9.6, features: ["Rubí"] },
        { id: 11, artist: "Omar Courtz", title: "$UELTA GATITA $UELTA", duration: "3:52", plays: "7.6M", rating: 9.1, features: ["Dei V", "Clarent", "Tito El Bambino"] },
        { id: 12, artist: "Omar Courtz", title: "WHAT U NEED? (SexPlaylist 2)", duration: "4:26", plays: "12M", rating: 9.4, features: ["Myke Towers"] },
        { id: 13, artist: "Omar Courtz", title: "WO OH OH", duration: "4:30", plays: "24M", rating: 9.7, features: ["ROA"] },
        { id: 14, artist: "Omar Courtz", title: "KOKO", duration: "3:16", plays: "21M", rating: 8.6, features: [] },
        { id: 15, artist: "Omar Courtz", title: "COMERNOS", duration: "3:42", plays: "41M", rating: 9.9, features: ["Bad Gyal"] },
        { id: 16, artist: "Omar Courtz", title: "SKY", duration: "3:34", plays: "5.3M", rating: 8.9, features: [] },
        { id: 17, artist: "Omar Courtz", title: "MOONLIGHT", duration: "4:16", plays: "4.8M", rating: 9.3, features: ["Eladio Carrión"] },
        { id: 18, artist: "Omar Courtz", title: "LAPOR SI MAÑANA NO ESTOY", duration: "4:25", plays: "31M", rating: 9.8, features: [] }
    ],
    rankings: [
        { id: 1, title: 'Top Global', rank: '#56' },
        { id: 2, title: 'Top del artista', rank: '#1' },
        { id: 3, title: 'Top del género', rank: '#4' },
    ],
    metrics: [
        { label: 'Ritmo', value: 9.2 },
        { label: 'Flow', value: 8.8 },
        { label: 'Letra', value: 7.5 },
        { label: 'Producción', value: 7.3 },
        { label: 'Impacto', value: 9.6 },
        { label: 'Innovación', value: 8.1 },
    ]
};

const userReviews = [
    {
        id: 1,
        username: 'Lucia.mp3',
        avatar: 'https://avatar.vercel.sh/lucia',
        rating: 9.6,
        timeAgo: 'Hace 2 horas',
        likes: 31,
        comments: 4,
        text: 'El álbum se siente coherente de principio a fin. Tiene un tono oscuro muy claro y varios picos que sí justifican el hype.',
    },
    {
        id: 2,
        username: 'NicoLynz',
        avatar: 'https://avatar.vercel.sh/nico',
        rating: 8.9,
        timeAgo: 'Hace 5 horas',
        likes: 18,
        comments: 2,
        text: 'No todos los tracks pegan igual, pero cuando encuentra el mood correcto el proyecto está muy por encima de la media.',
    },
    {
        id: 3,
        username: 'Sofia.wav',
        avatar: 'https://avatar.vercel.sh/sofia',
        rating: 9.3,
        timeAgo: 'Ayer',
        likes: 22,
        comments: 6,
        text: 'Producción muy cuidada, buenos feats y una identidad visual-sonora bastante marcada. Se siente como una era, no solo un drop.',
    }
];

export default function AlbumPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white py-12">

            {/* --- HERO SECTION --- */}
            <header className="relative h-[60vh] flex items-end overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={albumData.image}
                        className="w-full h-full object-cover scale-110 blur-3xl opacity-30"
                        alt="Blur background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 z-10">
                    <div className="flex flex-col md:flex-row gap-8 items-end">
                        <div className="shrink-0 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden border border-white/10 w-64 h-64 md:w-80 md:h-80 transition-transform hover:scale-[1.02] duration-500">
                            <img src={albumData.image} className="w-full h-full object-cover" alt={albumData.title} />
                        </div>

                        <div className="flex-1 space-y-5">
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                                {albumData.title}
                            </h1>

                            <div className="flex items-center gap-4 text-gray-400 font-medium">
                                <Link href={`/Artist/${albumData.artistId}`}className="cursor-pointer transition-colors text-lg text-white font-bold hover:text-violet-500">{albumData.artist}</Link>
                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                <span className="text-sm uppercase tracking-wider">{albumData.genre}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                <span className="text-sm">{albumData.releaseDate}</span>
                            </div>
                            <RatingAndQuickActions rating={albumData.rating} ratingHref={`/Reviews/Album/${albumData.id}`} />
                        </div>
                        
                    </div>
                </div>
            </header>

            {/* --- CONTENT SECTION --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                    {/* Columna Izquierda: Tracklist */}
                    <Tracklist tracks={albumData.tracks}/>

                    {/* Columna Derecha: Sidebar Rediseñado */}
                    <aside className="space-y-12">
                        <Profile data={albumData} />
                        <SonicProfile data={albumData} metrics={albumData.metrics} image={false}/>
                        <UserReviewsPanel reviews={userReviews} Id={albumData.id} type="Album" />
                    </aside>
                </div>
            </main>
        </div>
    );
}