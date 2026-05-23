import React from 'react';
import { Play, Disc, Star, Clock, Hash } from 'lucide-react';
import RatingAndQuickActions from '@/components/Rating/RatingAndQuickActions';
import RankingInfoSong from '@/components/RankingInfoSong';
import Link from 'next/link';
import UserReviewsPanel from '@/components/UserReviewsPanel';
import Profile from '@/components/Profile';

import SonicProfile from '@/components/SonicProfile';
import TrackDetails from './components/TrackDetails';
import BackButton from '@/components/BackButton';
import ArtistsPerformance from '@/components/ArtistsPerformance';
import { getSongData } from '@/services/song';

export default async function SongPage({ params }) {
    const resolvedParams = await params;
    const songData = await getSongData(resolvedParams.songId);

    if (!songData) {
        return <div>Song not found</div>;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">

            {/* --- HERO SECTION --- */}
            <header className="relative min-h-[530px] h-[70vh] flex items-end overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <img
                        src={songData.image}
                        className="w-full h-full object-cover scale-150 blur-3xl opacity-20"
                        alt="Background blur"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 z-10">
                    <BackButton type={"relative"} />
                    <div className="flex flex-col md:flex-row gap-12 items-center md:items-end text-center md:text-left">
                        <div className="relative group shrink-0 shadow-[0_0_80px_rgba(139,92,246,0.2)] rounded-full overflow-hidden w-64 h-64 md:w-80 md:h-80 border-4 border-white/5">
                            <img src={songData.image} className="w-full h-full object-cover" alt={songData.title} />

                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">
                                    {songData.title}
                                </h1>
                                <div className="flex items-center justify-center md:justify-start gap-3 text-2xl font-bold">
                                    <Link href={`/Artist/${songData.artistId}`}>
                                        <span className="text-white hover:text-violet-400 transition-colors cursor-pointer">{songData.artist}</span>
                                    </Link>
                                    {songData.features.length > 0 && (
                                        <span className="text-zinc-600 tracking-tighter font-black italic">
                                            FT. {songData.features.map((feat, i) => (
                                                <Link href={`/Artist/${feat.id}`} key={i} className="hover:text-violet-400 transition-colors">
                                                    {feat.name}{i < songData.features.length - 1 ? ", " : ""}
                                                </Link>
                                            ))}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <RatingAndQuickActions rating={songData.rating} ratingHref={`/Reviews/Song/${songData.id}`} links={songData.externalLinks} modalData={{
                                title: songData.title,
                                image: songData.image,
                                artist: songData.artist,
                                sonicProfile: songData.sonicProfile,
                                artistPerformance: songData.artistPerformance,
                            }} />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                

                {/* --- SECCIÓN SUPERIOR: DETALLES DEL TRACK (Ancho Completo) --- */}
                <TrackDetails songData={songData} />

                {/* --- GRID PRINCIPAL --- */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">

                    {/* IZQUIERDA: MÉTRICAS Y PERFORMANCE */}
                    <div className="space-y-12">
                        <SonicProfile data={songData} metrics={songData.sonicProfile} />

                        {/* PERFORMANCE */}
                        <ArtistsPerformance artistPerformance={songData.artistPerformance} />
                    </div>

                    {/* DERECHA: RANKINGS Y REVIEWS */}
                    <aside className="space-y-8">
                        {/* RANKING ASIDE (Antes era superior) */}
                        <div className="rounded-[2.5rem]">
                            <div className="flex items-center gap-3 mb-6">
                                <Hash className="text-violet-500 w-5 h-5" />
                                <h3 className="text-xl font-black uppercase tracking-tight">Rankings</h3>
                            </div>
                            <RankingInfoSong songData={songData} cols={2} />
                        </div>

                        <UserReviewsPanel reviews={songData.userReviews} Id={songData.id} type="Song" />
                    </aside>

                </div>
            </main>
        </div>
    );
}