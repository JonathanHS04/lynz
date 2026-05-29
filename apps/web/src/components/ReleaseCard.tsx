import React from 'react'
import Link from 'next/link';
import { Star } from 'lucide-react';
import { getRatingFont, getRatingBorder } from '@/utils/getRatingStyle';
import RatingSquare from './Rating/RatingSquare';
import { Album, AlbumArtistRelease } from '@repo/types';

const ReleaseCard = ({release, author=false}: {release: Album | AlbumArtistRelease, author?: boolean}) => {
    const releaseYear = release.releaseDate
        ? new Date(release.releaseDate).getFullYear()
        : "----";

    return (
        <Link href={`/Album/${release.id}`} key={release.id} className="h-full"> {/* h-full aquí para que el link estire la card */}
            <article className="group h-full flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] hover:bg-white/[0.03] transition-all">

                <div className="relative aspect-square overflow-hidden border-b border-white/5 shrink-0">
                    <img
                        src={release.image}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        alt={release.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <RatingSquare rating={release.rating} />
                </div>

                {/* Este div p-5 ahora crece para llenar el espacio sobrante */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                            {releaseYear} / {release.type}
                        </p>

                        {/* Aplicamos line-clamp-2 para que el texto nunca pase de 2 líneas */}
                        <h3 className="my-3 text-lg font-black uppercase tracking-tight leading-tight group-hover:text-violet-400 transition-colors line-clamp-2 min-h-[2.5rem]">
                            {release.name}
                        </h3>
                        {author ? (
                            <p className={`text-zinc-500 text-[10px] font-black`}>
                                {"artists" in release && release.artists.map((artist, i) => (
                                    <span key={i}>
                                        {artist.name}{i < release.artists.length - 1 ? "," : ""}
                                    </span>
                                ))}
                            </p>
                        ) : (
                            <></>
                        )}

                    </div>
                </div>

            </article>
        </Link>
    )
}

export default ReleaseCard
