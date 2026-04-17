import React from 'react'

import { MapPin } from 'lucide-react';
import RatingAndQuickActions from '@/components/Rating/RatingAndQuickActions';

const artistHero = ({artistData}) => {
    return (
        <header className="relative min-h-[68vh] flex items-end overflow-hidden border-b border-white/5"> 
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.1),transparent_28%),linear-gradient(180deg,rgba(18,18,22,0.95),#0a0a0a)]" /> 
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" /> 
            <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 pt-14 md:pt-20">
            <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-center md:items-end text-center md:text-left">
                <div className="relative shrink-0 flex items-center justify-center rounded-full border-4 border-white/5 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] shadow-[0_0_80px_rgba(139,92,246,0.18)] overflow-hidden w-64 h-64 md:w-80 md:h-80">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.24),transparent_42%),radial-gradient(circle_at_bottom,rgba(14,165,233,0.12),transparent_30%)]" />
                    <img src={artistData.portrait} alt={artistData.name} className="w-full h-full object-cover" /> </div> <div className="flex-1 space-y-6 pt-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl mb-12 md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none"> {artistData.name} </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-3 text-sm font-bold text-zinc-300 uppercase tracking-[0.18em]">
                            <span className="inline-flex items-center gap-2">
                                <MapPin size={16} className="text-sky-400" /> {artistData.country}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-zinc-600 hidden md:block" />
                            <span>{artistData.activeSince}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {artistData.genres.map((genre) => (
                            <span key={genre} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-zinc-300">
                                {genre}
                            </span>))}
                    </div>
                    <RatingAndQuickActions rating={artistData.rating} ratingHref={`/Reviews/Artist/${artistData.name}`} type='artist' links={artistData.externalLinks} />
                </div>
            </div>
        </div>
        </header>
    )
}

export default artistHero