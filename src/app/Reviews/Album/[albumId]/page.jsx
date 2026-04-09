import React from 'react';
import Link from 'next/link';
import { ChevronRight, MessageSquareMore, Star } from 'lucide-react';
import { getRatingFont } from '@/utils/getRatingStyle';

const reviews = [
    {
        id: 1,
        username: 'Lucia.mp3',
        avatar: 'https://avatar.vercel.sh/lucia',
        rating: 9.6,
        timeAgo: 'Hace 2 horas',
        likes: 31,
        comments: 4,
        text: 'El álbum se siente coherente de principio a fin. Tiene un tono oscuro muy claro y varios picos que sí justifican el hype.',
    },
    {
        id: 2,
        username: 'NicoLynz',
        avatar: 'https://avatar.vercel.sh/nico',
        rating: 8.9,
        timeAgo: 'Hace 5 horas',
        likes: 18,
        comments: 2,
        text: 'No todos los tracks pegan igual, pero cuando encuentra el mood correcto el proyecto está muy por encima de la media.',
    },
    {
        id: 3,
        username: 'Sofia.wav',
        avatar: 'https://avatar.vercel.sh/sofia',
        rating: 9.3,
        timeAgo: 'Ayer',
        likes: 22,
        comments: 6,
        text: 'Producción muy cuidada, buenos feats y una identidad visual-sonora bastante marcada. Se siente como una era, no solo un drop.',
    },
    {
        id: 4,
        username: 'MarcoTape',
        avatar: 'https://avatar.vercel.sh/marco',
        rating: 8.7,
        timeAgo: 'Hace 2 días',
        likes: 14,
        comments: 1,
        text: 'La segunda mitad me parece más fuerte que la primera. Igual el proyecto tiene una dirección bastante clara y eso se agradece.',
    },
];

export default function AlbumReviewsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white py-12">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 border-b border-white/5 pb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">Community</p>
                    <h1 className="mt-3 text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                        Todas las reseñas del álbum
                    </h1>
                </div>

                <div className="space-y-3">
                    {reviews.map((review) => (
                        <article key={review.id} className="rounded-[1.5rem] border border-white/8 bg-[linear-gradient(145deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-4 md:p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <img
                                        src={review.avatar}
                                        alt={review.username}
                                        className="h-12 w-12 shrink-0 rounded-full object-cover border border-white/10"
                                    />

                                    <div className="min-w-0">
                                        <p className="truncate text-base font-black uppercase tracking-tight text-white">
                                            {review.username}
                                        </p>
                                        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">
                                            {review.timeAgo}
                                        </p>
                                    </div>
                                </div>

                                <div className={`inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm font-black ${getRatingFont(review.rating)}`}>
                                    <Star className="h-4 w-4 fill-current" strokeWidth={2.2} />
                                    {review.rating.toFixed(1)}
                                </div>
                            </div>

                            <p className="mt-4 text-sm md:text-base leading-relaxed text-zinc-300/85">
                                {review.text}
                            </p>

                            <div className="mt-4 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                <span>{review.likes} likes</span>
                                <span>{review.comments} comentarios</span>
                                <Link href={`/Reviews/Album/1/${review.id}`} className="ml-auto inline-flex items-center gap-1.5 transition-colors hover:text-white">
                                    Abrir review
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}