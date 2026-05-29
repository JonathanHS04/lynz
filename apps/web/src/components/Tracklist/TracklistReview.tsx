import React from 'react'
import { MessageSquare, Quote } from 'lucide-react'
import getRatingStyle from '@/utils/getRatingStyle';
import RatingSquare from '../Rating/RatingSquare';
import Link from 'next/link';
import { Album, AlbumReview } from '@repo/types';

const TracklistReview = ({ albumReviewData }: { albumReviewData: AlbumReview }) => {

  return (
    <section className="mt-16 bg-[#111] border border-white/5 rounded-3xl p-8 lg:p-10">
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
        <div>
          <h3 className="text-3xl font-black text-white tracking-tighter">
            Track<span className="text-violet-500">List</span>
          </h3>
        </div>
        <div className="hidden sm:block text-xs font-mono text-gray-500 border border-white/10 px-4 py-2 rounded-full uppercase tracking-tighter">
          {albumReviewData.tracks.length} tracks • {albumReviewData.duration}
        </div>
      </div>
      
      <div className="space-y-12">
        {albumReviewData.songsReviews.map((track, index) => (
          <div key={index} className="relative group">
            {/* Línea conectora vertical entre tracks (opcional para look editorial) */}
            {index !== albumReviewData.songsReviews.length - 1 && (
              <div className="absolute left-[31px] top-12 bottom-[-48px] w-[1px] bg-gradient-to-b from-white/10 to-transparent z-0"></div>
            )}

            <div className="flex flex-col md:flex-row gap-6 relative z-10">
              
              {/* IZQUIERDA: Header del Track (Número y Rating) */}
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4 shrink-0">
                <div className={`flex items-center justify-center font-black font-mono text-xl tracking-tighter`}>
                  <RatingSquare rating={track.userRating} variant="inline" />
                </div>
                <span className="text-gray-700 font-mono text-sm font-bold md:ml-1">
                  #{(index + 1).toString().padStart(2, '0')}
                </span>
              </div>

              {/* DERECHA: Contenido del Análisis */}
              <div className="flex-1">
                <div className="flex items-baseline justify-between mb-3 gap-4">
                  <Link href = {`/Song/${track.songId}`} className="text-xl font-bold text-white hover:text-violet-400 transition-colors">
                    {track.songName}
                  </Link>
                  <span className="text-gray-600 text-xs font-mono shrink-0 uppercase tracking-widest italic">
                    [{track.duration}]
                  </span>
                </div>

                {/* Comentario / Review de la canción */}
                {track.reviewText ? (
                  <div className="relative">
                    <p className="text-gray-400 leading-relaxed text-[16px] font-light max-w-2xl italic border-l-2 border-violet-500/30 pl-6 py-1">
                      {track.reviewText}
                    </p>
                  </div>
                ) : (<></>)}

              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TracklistReview