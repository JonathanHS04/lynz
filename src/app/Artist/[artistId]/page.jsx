import React from 'react';
import { MapPin } from 'lucide-react';
import RatingAndQuickActions from '@/components/RatingAndQuickActions';
import Tracklist from '@/components/Tracklist';
import ReleaseCard from '@/components/ReleaseCard';
import SonicProfile from '@/components/SonicProfile';
import { userReviews } from '@/app/Song/[songId]/mockData';
import RankingInfoSong from '@/components/RankingInfoSong';
import UserReviewsPanel from '@/components/UserReviewsPanel';
import Profile from '@/components/Profile';

const artistData = {
    name: 'Omar Courtz',
    verified: true,
    rating: 9.7,
    country: 'Puerto Rico',
    activeSince: '2019',
    genreLine: 'Reggaetón / Trap Latino / Experimental',
    image: 'https://is1-ssl.mzstatic.com/image/thumb/AMCArtistImages221/v4/f5/7c/21/f57c21d6-590a-b07e-1027-e92e6c62cfe6/ami-identity-cee5abcdd03c2870378144a376dce33d-2025-04-18T00-19-44.218Z_cropped.png/486x486bb.png',
    portrait: 'https://is1-ssl.mzstatic.com/image/thumb/AMCArtistImages221/v4/f5/7c/21/f57c21d6-590a-b07e-1027-e92e6c62cfe6/ami-identity-cee5abcdd03c2870378144a376dce33d-2025-04-18T00-19-44.218Z_cropped.png/1280x720bb.png',
    description: 'Una de las voces que mejor está empujando el urbano hacia terrenos más oscuros, sensuales y cinematográficos. Su propuesta mezcla melodías pegajosas, texturas nocturnas y una identidad visual muy marcada.',
    genres: ['Reggaetón', 'Trap Latino', 'Alt Urbano'],
    milestones: [
        { label: 'Top Track', value: 'COMERNOS' },
        { label: 'Latest Era', value: 'POR SI MAÑANA NO ESTOY' },
        { label: 'Peak Reach', value: '41M plays' },
    ],
    topTracks: [
        { id: 15, artist: "Omar Courtz", title: 'COMERNOS', albumId: 1, album: 'POR SI MAÑANA NO ESTOY', plays: '41M', duration: '3:42', rating: 9.9, features: ['Bad Gyal'], image: 'https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg' },
        { id: 18, artist: "Omar Courtz", title: 'POR SI MAÑANA NO ESTOY', albumId: 1, album: 'POR SI MAÑANA NO ESTOY', plays: '31M', duration: '4:25', rating: 9.8, features: [], image: 'https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg' },
        { id: 3, artist: "Omar Courtz", title: 'FOREVER TU GANTEL', albumId: 1, album: 'POR SI MAÑANA NO ESTOY', plays: '20M', duration: '3:47', rating: 9.5, features: ["Ñengo Flow"], image: 'https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg' },
        { id: 12, artist: "Omar Courtz", title: 'WHAT U NEED?', albumId: 1, album: 'POR SI MAÑANA NO ESTOY', plays: '12M', duration: '4:26', rating: 9.4, features: ['Myke Towers'], image: 'https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg' },
        { id: 9, artist: "Omar Courtz", title: 'SI ESTÁS CON ALGUIEN', albumId: 1, album: 'POR SI MAÑANA NO ESTOY', plays: '15M', duration: '4:12', rating: 9.3, features: [], image: 'https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg' },
    ],
    releases: [
        { id: 1, title: 'POR SI MAÑANA NO ESTOY', year: '2026', type: 'Álbum', image: 'https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg', rating: 9.4 },
        { id: 3, title: 'PRIMERA MUSA', year: '2023', type: 'EP', image: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/30/0f/48/300f48fd-f560-8aaf-17c1-00a4531ad61a/198588847695.jpg/1200x630bb.jpg', rating: 8.6 },
    ],
    collaborators: [
        { name: 'Bad Gyal', role: 'Feature recurrente' },
        { name: 'Myke Towers', role: 'Colaboración clave' },
        { name: 'Eladio Carrión', role: 'Puente con el trap' },
    ],
    sonicProfile: [
        { label: 'Ritmo', value: 9.2 },
        { label: 'Flow', value: 8.8 },
        { label: 'Letra', value: 7.5 },
        { label: 'Producción', value: 7.3 },
        { label: 'Impacto', value: 9.6 },
        { label: 'Innovación', value: 8.1 },
    ],
    rankings: [
        { id: 1, title: 'Top Global', rank: '#56' },
        { id: 2, title: 'Top del género', rank: '#4' }
    ]
};

const sectionLabel = 'text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500';

export default function ArtistPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">

            <header className="relative min-h-[62vh] flex items-end overflow-hidden border-b border-white/5"> <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.1),transparent_28%),linear-gradient(180deg,rgba(18,18,22,0.95),#0a0a0a)]" /> <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" /> <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 pt-14 md:pt-20">
                <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-center md:items-end text-center md:text-left">
                    <div className="relative shrink-0 flex items-center justify-center rounded-full border-4 border-white/5 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] shadow-[0_0_80px_rgba(139,92,246,0.18)] overflow-hidden w-64 h-64 md:w-80 md:h-80">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.24),transparent_42%),radial-gradient(circle_at_bottom,rgba(14,165,233,0.12),transparent_30%)]" />
                        <img src={artistData.portrait} alt={artistData.name} className="w-full h-full object-cover" /> </div> <div className="flex-1 space-y-6 pt-12">
                        <div className="space-y-4">
                            <h1 className="text-4xl mb-12 md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none"> {artistData.name} </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-3 text-sm font-bold text-zinc-300 uppercase tracking-[0.18em]">
                                <span className="inline-flex items-center gap-2">
                                    <MapPin size={16} className="text-sky-400" /> {artistData.country}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-zinc-600 hidden md:block" />
                                <span>{artistData.activeSince}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {artistData.genres.map((genre) => (
                                <span key={genre} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-300 hover:text-violet-400 hover:border-violet-400 transition-colors cursor-pointer">
                                    {genre}
                                </span>))}
                        </div>
                        <RatingAndQuickActions rating={artistData.rating} ratingHref={`/Reviews/Artist/${artistData.name}`} />
                    </div>
                </div>
            </div>
            </header>


            <main className="max-w-7xl mx-auto px-6 py-14 space-y-14">

                {/* --- MAIN GRID --- */}
                <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">

                    {/* IZQUIERDA */}
                    <div className="space-y-12">


                        {/* RELEASES */}
                        <section className="space-y-6">
                            <div>
                                <p className={sectionLabel}>Discografía</p>
                                <h2 className="text-3xl font-black">Lanzamientos</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {artistData.releases.map(r => (
                                    <ReleaseCard key={r.id} release={r} />
                                ))}
                            </div>
                        </section>


                        {/* TRACKLIST */}
                        <section className="rounded-3xl p-6">
                            <div className="mb-6">
                                <p className={sectionLabel}>Popular</p>
                                <h2 className="text-3xl font-black">Top Tracks</h2>
                            </div>

                            <Tracklist
                                tracks = {artistData.topTracks}
                                images={true}
                            />
                        </section>
                        {/* SONIC PROFILE */}
                        <SonicProfile data={artistData} metrics={artistData.sonicProfile} />

                    </div>


                    {/* DERECHA */}
                    <aside className="space-y-8 lg:top-24 self-start">
                        <h2 className='text-3xl font-black'>Biografía</h2>

                        <Profile data={artistData} />

                        {/* REVIEWS */}
                        <UserReviewsPanel
                            reviews={userReviews}
                            Id={artistData.topTracks[0].id}
                            type="artist"
                        />

                    </aside>

                </section>

            </main>
        </div>
    );
}