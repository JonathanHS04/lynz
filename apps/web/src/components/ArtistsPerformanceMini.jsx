import React from 'react'
import Link from 'next/link';
import { getRatingFont } from '@/utils/getRatingStyle';


const ArtistsPerformanceMini = ({ artistsPerformance = [] }) => {
    return (
        <div className="flex gap-8 items-center justify-start mt-2 pb-4">
            {artistsPerformance.map((artist) => (
                <div key={artist.id} className={`flex items-center justify-start gap-8 p-4 rounded-2xl bg-white/[0.03] transition-colors`}>
                    <div className="flex items-center gap-4">
                        <Link href={`/Artist/${artist.id}`}>
                            <img src={artist.image} className="w-10 h-10 rounded-full object-cover" alt={artist.name} />
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
    )
}

export default ArtistsPerformanceMini