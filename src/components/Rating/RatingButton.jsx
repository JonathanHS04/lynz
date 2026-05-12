import React from 'react'
import { getRatingFont } from '@/utils/getRatingStyle';
import { Star } from 'lucide-react';
import Link from 'next/link';

const RatingButton = ({ href = '#', rating, type = "default" }) => {
    const isArtist = type === "artist";
    const isReview = type === "review";

    // 1. Diferenciamos la interactividad visual
    const containerClasses = `group relative flex items-center gap-3 transition-all duration-300 focus:outline-none 
        ${(isArtist || isReview) 
            ? 'cursor-default opacity-90' // El artista o reseña es un poco más sutil
            : 'cursor-pointer active:scale-95' // El link flota al pasar el mouse
        }`;

    const content = (
        <>
            {/* Glow solo para el botón real */}
            {!(isArtist || isReview) && (
                <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
            
            <div className={`
                flex items-center gap-2.5 rounded-2xl border-[1.5px] px-6 py-2 backdrop-blur-md transition-all duration-300 
                ${getRatingFont(rating)} 
                ${(isArtist || isReview) 
                    ? 'border-current bg-black/20' // Fondo más tenue para el decorativo
                    : 'border-white/10 bg-black/50 group-hover:border-current group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                }
            `}>
                <Star className="w-12 h-12 fill-current" strokeWidth={2.5} />
                <span className="text-5xl font-black tracking-tighter">
                    {(rating ? (rating < 10 ? rating.toFixed(1) : rating.toFixed(0)) : 'N/A')}
                </span>
            </div>
            
            {/* Opcional: Un pequeño texto que indique "Ver reseñas" solo en el botón */}
            {!(isArtist || isReview) && (
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-60 transition-opacity whitespace-nowrap">
                    Ver reseñas
                </span>
            )}
        </>
    );

    return isArtist ? (
        <div className={containerClasses}>{content}</div>
    ) : (
        <Link className={containerClasses} href={href}>{content}</Link>
    );
}

export default RatingButton;