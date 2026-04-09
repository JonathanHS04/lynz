import React from 'react'
import Link from 'next/link';
import { Star } from 'lucide-react';
import { getRatingFont, getRatingBorder } from '@/utils/getRatingStyle';

const ReleaseCard = ({release, author=false}) => {
    return (
        <Link href={`/Album/${release.id}`} key={release.id} className="h-full"> {/* h-full aquí para que el link estire la card */}
            <article className="group h-full flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] hover:bg-white/[0.03] transition-all">

                <div className="relative aspect-square overflow-hidden border-b border-white/5 shrink-0">
                    <img
                        src={release.image}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        alt={release.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <div className={`flex justify-center items-center gap-1 absolute right-4 top-4 rounded-xl border bg-black/65 px-3 py-2 backdrop-blur-sm ${getRatingBorder(release.rating)}`}>
                        <Star className={`h-3 w-3 fill-current ${getRatingFont(release.rating)}`} strokeWidth={2.2} />
                        <span className={`text-sm font-black ${getRatingFont(release.rating)}`}>
                            {release.rating.toFixed(1)}
                        </span>
                    </div>
                </div>

                {/* Este div p-5 ahora crece para llenar el espacio sobrante */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                            {release.year} / {release.type}
                        </p>

                        {/* Aplicamos line-clamp-2 para que el texto nunca pase de 2 líneas */}
                        <h3 className="my-3 text-lg font-black uppercase tracking-tight leading-tight group-hover:text-violet-400 transition-colors line-clamp-2 min-h-[2.5rem]">
                            {release.title}
                        </h3>
                        {author ? (
                            <p className={`text-zinc-500 text-[10px]font-black`}>
                                {release.artist}
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