"use client";
import React from 'react'

import { Clock, Disc } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const TrackDetails = ({ songData }) => {
    const [imgError, setImgError] = useState(!songData?.albumImage);

    return (
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
                                src={songData.albumImage}
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

                <div className="border border-violet-300 px-6 py-3 rounded-2xl text-center">
                    <p className="text-[10px] uppercase tracking-widest text-violet-300 font-bold leading-none mb-1">Año</p>
                    <p className="text-violet-300 text-2xl font-black leading-none">{songData.releaseDate}</p>
                </div>
            </div>
        </section>
    )
}

export default TrackDetails