import React from 'react'
import { getRatingFont } from '@/utils/getRatingStyle';
import { Star } from 'lucide-react';
import Link from 'next/link';

const RatingButton = ({ href = '#', rating }) => {
    return (
        <Link
            className="group relative flex items-center gap-3 transition-all active:scale-95 focus:outline-none cursor-pointer"
            href={href}
        >
            {/* Glow Effect de fondo al hover */}
            <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className={`flex items-center gap-2.5 rounded-2xl border-[1.5px] border-white/10 bg-black/40 px-6 py-2 backdrop-blur-md transition-all duration-300 group-hover:border-current ${getRatingFont(rating)}`}>
                <Star className="w-12 h-12 fill-current" strokeWidth={2.5} />
                <span className="text-5xl font-black tracking-tighter">
                    {(rating < 10 ? rating.toFixed(1) : rating.toFixed(0))}
                </span>
            </div>
        </Link>
    )
}

export default RatingButton