import React from 'react'
import { getRatingFont } from '@/utils/getRatingStyle';
import { Star } from 'lucide-react';

const RatingButton = ({ rating }) => {
    return (
        <button className="group relative flex items-center gap-3 transition-all active:scale-95 focus:outline-none cursor-pointer">
            {/* Glow Effect de fondo al hover */}
            <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className={`
                  flex items-center gap-2.5 px-6 py-2 rounded-2xl
                  bg-black/40 backdrop-blur-md border-[1.5px] border-white/10
                  group-hover:border-current transition-all duration-300
                  ${getRatingFont(rating)}
                `}>
                <Star className="w-12 h-12 fill-current" strokeWidth={2.5} />
                <span className="text-5xl font-black tracking-tighter">
                    {rating.toFixed(1)}
                </span>
            </div>
        </button>
    )
}

export default RatingButton