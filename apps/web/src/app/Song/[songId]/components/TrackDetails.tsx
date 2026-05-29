"use client";
import React from 'react'
import { Clock, Disc } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { formatDuration } from '@/utils/formatTime';
import { Song } from '@repo/types';

const TrackDetails = ({ songData }: {songData: Song}) => {
    const [imgError, setImgError] = useState(!songData?.image);


    return (
        <section className="rounded-[2.5rem] p-8 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-8">
                {/* 1. Sección Álbum */}
                <div className="flex items-center gap-4">
                    <Link href={`/Album/${songData.albums[0].image}`} className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                        {imgError ? (
                            <Disc className="text-violet-400 w-6 h-6" />
                        ) : (
                            <img
                                src={songData.image}
                                className="object-contain"
                                onError={() => setImgError(true)}
                                alt={songData.albums[0].name}
                            />
                        )}
                    </Link>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Del album</p>
                        <Link href={`/Album/${songData.albums[0].id}`}>
                            <p className="text-lg font-black italic uppercase hover:text-violet-400 transition-colors cursor-pointer">
                                {songData.albums[0].name}
                            </p>
                        </Link>
                    </div>
                </div>

                <div className="h-12 w-[1px] bg-white/10 hidden md:block" />

                {/* 2. Sección Duración */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center border border-white/10">
                        <Clock className="text-zinc-400 w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Duración</p>
                        <p className="text-lg font-black">{formatDuration(songData.duration)}</p>
                    </div>
                </div>

                {/* 4. Sección Año (Usando ml-auto para empujar a la derecha) */}
                <div className="border border-violet-300 px-6 py-3 rounded-2xl text-center md:ml-auto">
                    <p className="text-[10px] uppercase tracking-widest text-violet-300 font-bold leading-none mb-1">Año</p>
                    <p className="text-violet-300 text-2xl font-black leading-none">{new Date(songData.releaseDate).getFullYear()}</p>
                </div>
            </div>
        </section>
    )
}

export default TrackDetails