"use client";

import React, { useState } from 'react';
import { getRatingFont, getRatingBorder, getRatingHoverBorder } from '@/utils/getRatingStyle';
import { Play, Disc, Star, Clock, Hash } from 'lucide-react';
import RatingAndQuickActions from '@/components/RatingAndQuickActions';
import RankingInfoSong from '@/components/RankingInfoSong';
import Link from 'next/link';
import UserReviewsPanel from '@/components/UserReviewsPanel';
import Profile from '@/components/Profile';

import { userReviews, sonicProfile, artistPerformance, songData } from './mockData';
import SonicProfile from '@/components/SonicProfile';

export default function SongPage() {
    const [imgError, setImgError] = useState(false);
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">

            {/* --- HERO SECTION --- */}
            <header className="relative h-[70vh] flex items-end overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <img
                        src={songData.image}
                        className="w-full h-full object-cover scale-150 blur-3xl opacity-20"
                        alt="Background blur"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 z-10">
                    <div className="flex flex-col md:flex-row gap-12 items-center md:items-end text-center md:text-left">
                        <div className="relative group shrink-0 shadow-[0_0_80px_rgba(139,92,246,0.2)] rounded-full overflow-hidden w-64 h-64 md:w-80 md:h-80 border-4 border-white/5 cursor-pointer">
                            <img src={songData.image} className="w-full h-full object-cover" alt={songData.title} />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-16 h-16 fill-white" />
                            </div>
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
                                                    {feat}{i < songData.features.length - 1 ? ", " : ""}
                                                </Link>
                                            ))}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <RatingAndQuickActions rating={songData.rating} />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

                {/* --- SECCIÓN SUPERIOR: DETALLES DEL TRACK (Ancho Completo) --- */}
                <section className="rounded-[2.5rem] p-8 backdrop-blur-md">
                    <div className="flex flex-wrap items-center gap-8 justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={`/Album/${songData.albumId}`} className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                                {imgError ? (
                                    /* Si hay error, sale el disco */
                                    <Disc className="text-violet-400 w-6 h-6" />
                                ) : (
                                    /* Si no hay error, intentamos cargar la imagen */
                                    <img
                                        src="https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg"
                                        alt={songData.genre}
                                        className="object-contain"
                                        onError={() => setImgError(true)} // Si el archivo no existe, activa el error
                                    />
                                )}
                            </Link>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Del album</p>
                                <Link href={`/Album/${songData.albumId}`}>
                                    <p className="text-lg font-black italic uppercase hover:text-violet-400 transition-colors cursor-pointer">{songData.album}</p>
                                </Link>
                            </div>
                        </div>

                        <div className="h-12 w-[1px] bg-white/10 hidden md:block" />

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center border border-white/10">
                                <Clock className="text-zinc-400 w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Duración</p>
                                <p className="text-lg font-black">{songData.duration}</p>
                            </div>
                        </div>

                        <div className="h-12 w-[1px] bg-white/10 hidden md:block" />

                        <div className="flex-1 min-w-[200px]">
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Productores</p>
                            <div className="flex flex-wrap gap-2">
                                {songData.producers.map((p, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-xs font-bold border border-white/5">
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-violet-500 px-6 py-3 rounded-2xl text-center">
                            <p className="text-[10px] uppercase tracking-widest text-violet-100 font-bold leading-none mb-1">Año</p>
                            <p className="text-2xl font-black leading-none">{songData.releaseDate}</p>
                        </div>
                    </div>
                </section>

                {/* --- GRID PRINCIPAL --- */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">

                    {/* IZQUIERDA: MÉTRICAS Y PERFORMANCE */}
                    <div className="space-y-12">
                        <SonicProfile data={songData} metrics={sonicProfile} />

                        {/* PERFORMANCE */}
                        <article className="rounded-[2.5rem] bg-zinc-900/20 p-8">
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Basado en las reseñas</p>
                            <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Performance por Artista</h2>
                            <div className="space-y-4">
                                {artistPerformance.map((artist) => (
                                    <div key={artist.id} className={`flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 transition-colors`}>
                                        <div className="flex items-center gap-4">
                                            <Link href={`/Artist/${artist.id}`}>
                                                <img src={artist.image} className="w-14 h-14 rounded-xl object-cover" alt={artist.name} />
                                            </Link>
                                            <div>
                                                <p className={`font-black text-lg leading-tight text-white hover:text-violet-400 transition-colors`}><Link href={`/Artist/${artist.id}`}>{artist.name}</Link></p>
                                                <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">{artist.role}</p>
                                            </div>
                                        </div>
                                        <span className={`text-3xl font-black italic ${getRatingFont(artist.score)}`}>{artist.score.toFixed(1)}</span>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </div>

                    {/* DERECHA: RANKINGS Y REVIEWS */}
                    <aside className="space-y-8">
                        {/* RANKING ASIDE (Antes era superior) */}
                        <div className="rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <Hash className="text-violet-500 w-5 h-5" />
                                <h3 className="text-xl font-black uppercase tracking-tight">Rankings</h3>
                            </div>
                            <RankingInfoSong songData={songData} cols={2} />
                        </div>

                        <UserReviewsPanel reviews={userReviews} Id={songData.id} type="song" />
                    </aside>

                </div>
            </main>
        </div>
    );
}