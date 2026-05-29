import React from 'react';
import Link from 'next/link';
import { MapPin, Star, Users } from 'lucide-react';
import { getRatingBorder, getRatingFont } from '@/utils/getRatingStyle';
import { searchArtists } from '@/services/search';
import { getInitials } from '@/utils/getInitials';
import { Artist } from '@repo/types/src/artistsAlbumsSongs/artist';

function ArtistResultCard({ artist }: { artist: Artist }) {

    // Verificamos si es un placeholder
    const isPlaceholder = artist.image == null;

    return (
        <Link
            href={"/Artist/" + artist.id}
            className="group block"
        >
            <article className="rounded-[2rem] border border-white/6 bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/12 hover:bg-white/[0.03] md:p-6">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                            
                            {/* CONTENEDOR DE IMAGEN / INICIALES */}
                            <div className="relative h-20 w-20 shrink-0 flex items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-900 sm:h-24 sm:w-24">
                                {!isPlaceholder ? (
                                    <img
                                        src={artist.image}
                                        alt={artist.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <span className="text-3xl sm:text-4xl font-black text-white/20 select-none tracking-tighter">
                                        {getInitials(artist.name)}
                                    </span>
                                )}
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">
                                    Artist Match
                                </p>
                                <h3 className="mt-2 truncate text-2xl font-black uppercase tracking-tight text-white transition-colors group-hover:text-violet-300 sm:text-3xl">
                                    {artist.name}
                                </h3>
                                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 sm:text-xs">
                                    <span className="inline-flex items-center gap-1.5">
                                        <MapPin size={14} className="text-sky-400" />
                                        {artist.country}
                                    </span>
                                    <span className="hidden h-1 w-1 rounded-full bg-zinc-600 sm:block" />
                                    <span>Activo desde {artist.activeSince}</span>
                                </div>
                            </div>
                        </div>

                        <div className={`inline-flex items-center gap-2 self-start rounded-2xl border px-3 py-2 sm:self-center ${getRatingBorder(artist.rating)}`}>
                            <Star className={`h-4 w-4 fill-current ${getRatingFont(artist.rating)}`} />
                            <span className={`text-2xl font-black ${getRatingFont(artist.rating)}`}>
                                {Number(artist.rating).toFixed(1)}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
                        {/* LEFT: Géneros */}
                        <div className="flex flex-col gap-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500">
                                Géneros
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {artist.genres.map((genre) => (
                                    <span
                                        key={genre}
                                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-300 transition-colors hover:bg-white/[0.08]"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Rankings */}
                        <div className="flex gap-3">
                            {artist.rankings.map((ranking) => (
                                <div
                                    key={ranking.id}
                                    className="rounded-[1.2rem] border border-white/6 bg-black/30 px-4 py-3"
                                >
                                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500">
                                        {ranking.title}
                                    </p>
                                    <p className="mt-1 text-xl font-black text-white">
                                        {ranking.rank}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default async function SearchArtistsPage({ searchParams }) {
    const params = await searchParams;
    const query = params.q || "";

    let results: Artist[] = [];
    if (query) {
        results = await searchArtists(query);
    }
        
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <main className="mx-auto max-w-7xl px-4 pt-28 pb-12 space-y-10">

                {/* HEADER - matches exact style from Search/page.jsx */}
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-zinc-500">
                            Resultados de búsqueda
                        </p>
                        <h2 className="mt-2 flex items-center gap-3 text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                            <Users className="h-6 w-6 text-violet-400" />
                            ARTISTAS
                        </h2>
                    </div>
                </div>

                <div className="max-w-6xl space-y-6">
                    {results.map((artist) => (
                        <ArtistResultCard key={artist.id} artist={artist} />
                    ))}
                </div>
            </main>
        </div>
    );
}
