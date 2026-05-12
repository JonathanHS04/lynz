import React from 'react'
import Link from 'next/link';
import { getRatingFont } from '@/utils/getRatingStyle';

const ArtistsPerformance = ({artistPerformance}) => {
    console.log(artistPerformance)
    return (
        <article className="rounded-[2.5rem] p-8">
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
                        <span className={`text-3xl font-black italic ${getRatingFont(artist.rating)}`}>{artist.rating.toFixed(1)}</span>
                    </div>
                ))}
            </div>
        </article>
    )
}

export default ArtistsPerformance