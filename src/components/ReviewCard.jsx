import { Star } from 'lucide-react';
import { getRatingBorder, getRatingFont } from '@/utils/getRatingStyle';
import Link from 'next/link';

const ReviewCard = ({ review }) => (
  <article className="group cursor-pointer">
    <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-900 border border-white/5 mb-4">
      <img 
        src={review.image} 
        alt={review.album} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* --- Elementos Flotantes --- */}

      {/* 1. Esquina Superior Derecha: Perfil del Usuario (Avatar + Nombre) */}
      <div className="absolute top-3 right-3 z-10">
        <div className="flex items-center gap-2 p-1 pr-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-300 group-hover:border-violet-500/40 group-hover:bg-black/80">
          <div className="relative shrink-0">
            <img 
              src={review.userAvatar || "https://avatar.vercel.sh/jonathan"} 
              alt="User avatar" 
              className="w-7 h-7 rounded-full object-cover border border-white/10"
            />
            {/* Indicador de status (Lynz. brand) */}
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-violet-500 rounded-full border border-black shadow-lg" />
          </div>
          
          {/* Nombre de Usuario */}
          <span className="text-[11px] font-bold text-gray-200 tracking-tight whitespace-nowrap">
            {review.username || "Jonathan"}
          </span>
        </div>
      </div>

      {/* 2. Esquina Inferior Derecha: Rating con Estilo Dinámico */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className={`absolute flex justify-center items-center gap-1 right-4 bottom-4 rounded-xl border bg-black/65 px-3 py-2 backdrop-blur-sm ${getRatingBorder(review.rating)}`}>
        <Star className={`h-3 w-3 fill-current ${getRatingFont(review.rating)}`} strokeWidth={2.2} />
        <span className={`text-sm font-black ${getRatingFont(review.rating)}`}>
          {review.rating.toFixed(1)}
        </span>
      </div>
    </div>

    {/* --- Información del Álbum --- */}
    <div className="pl-1">
      <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-1 leading-snug">
        {review.album}
      </h3>
      <p className="text-sm text-gray-500 font-medium">{review.artist}</p>
    </div>
  </article>
);

export default ReviewCard;