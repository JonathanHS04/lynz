import React from 'react'
import Link from 'next/link'
import { getRatingFont, getRatingHoverBorder } from '@/utils/getRatingStyle';
import { formatDuration } from '@/utils/formatTime';

const Tracklist = ({ tracks, images=false }) => {
    return (
        <div className="lg:col-span-2 space-y-8">

            <div className="space-y-1">
                {tracks?.map((track, index) => (
                    <Link href={`/Song/${track.id}`} key={track.id}>
                        <div
                            className={`flex items-center gap-4 p-4 rounded-xl transition-all group cursor-pointer border border-transparent ${getRatingHoverBorder(track.rating)} transition-colors`}
                        >

                            <span className={`w-6 text-sm font-bold ${getRatingFont(track.rating)} text-center`}>
                                {(index + 1).toString().padStart(2, '0')}
                            </span>

                            {/* Si la prop images es true, mostramos la imagen del álbum al lado de cada track. Esto se usará en la página del artista para darle más vida al listado de canciones */}
                                {images && (
                                    <img
                                        src={track.image}
                                        alt={track.title}
                                        className="w-12 h-12"
                                    />
                                )}

                            <div className="flex-1 ">
                                <h4 className={`text-sm font-bold ${getRatingFont(track.rating)} uppercase tracking-tight`}>
                                    {track.title}
                                </h4>

                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                    {/* Artista Principal */}
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">
                                        {track.artist}
                                    </span>

                                    {/* Renderizado de Features */}
                                    {track.features.length > 0 && (
                                        <>
                                            <span className="text-[10px] text-zinc-700 font-black">FT.</span>
                                            <div className="flex gap-1.5">
                                                {track.features.map((feat, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-[10px] text-zinc-700 font-bold uppercase tracking-wider"
                                                    >
                                                        {feat}{i < track.features.length - 1 ? "," : ""}
                                                    </span>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className={`text-sm font-black w-12 text-center transition-transform group-hover:scale-110 ${getRatingFont(track.rating)}`}>
                                {track.rating.toFixed(1)}
                            </div>

                            <span className="text-xs text-zinc-500 font-mono w-12 text-right group-hover:text-zinc-300">
                                {formatDuration(track.duration)}
                            </span>

                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Tracklist