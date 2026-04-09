"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageSquareMore, Star } from 'lucide-react';
import { getRatingFont } from '@/utils/getRatingStyle';

const UserReviewsPanel = ({ reviews = [], type, Id }) => {
    const [reviewState, setReviewState] = useState(
        reviews.map((review) => ({
            ...review,
            liked: false,
        }))
    );

    const toggleLike = (reviewId) => {
        setReviewState((currentReviews) =>
            currentReviews.map((review) => {
                if (review.id !== reviewId) return review;

                return {
                    ...review,
                    liked: !review.liked,
                    likes: review.liked ? review.likes - 1 : review.likes + 1,
                };
            })
        );
    };

    return (
        <section className="rounded-[1rem] border border-white/10 bg-white/[0.02] p-5">
            
            {/* HEADER */}
            <div className="border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <MessageSquareMore size={18} className="text-violet-400" />
                    <h3 className="text-lg font-black tracking-tight text-white leading-none">
                        Reseñas destacadas
                    </h3>
                </div>
            </div>

            {/* LISTA DE RESEÑAS */}
            <div className="mt-2">
                {reviewState.map((review) => (
                    <article
                        key={review.id}
                        className="border-b border-white/5 py-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            
                            {/* USER */}
                            <div className="flex items-center gap-3 min-w-0">
                                <Link href={`/User/${review.username}`}>
                                <img
                                    src={review.avatar}
                                    alt={review.username}
                                    className="h-10 w-10 shrink-0 rounded-full object-cover border border-white/10"
                                />
                                </Link>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-black tracking-tight text-white">
                                        <Link
                                            href={`/User/${review.username}`}
                                            className="hover:underline"
                                        >
                                            {review.username}
                                        </Link>
                                    </p>
                                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">
                                        {review.timeAgo}
                                    </p>
                                </div>
                            </div>

                            {/* RATING */}
                            <div className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/30 px-2.5 py-1.5 text-xs font-black ${getRatingFont(review.rating)}`}>
                                <Star className="h-4 w-4 fill-current" strokeWidth={2.2} />
                                <span>{review.rating.toFixed(1)}</span>
                            </div>
                        </div>

                        {/* TEXTO */}
                        <p className="mt-3 text-sm leading-relaxed text-zinc-300/85 line-clamp-2">
                            {review.text}
                        </p>

                        {/* ACCIONES */}
                        <div className="mt-3 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    toggleLike(review.id);
                                }}
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition-colors cursor-pointer ${
                                    review.liked
                                        ? 'border-violet-500/50 bg-violet-500/10 text-violet-300'
                                        : 'border-white/8 bg-black/20 text-zinc-400 hover:text-white hover:border-white/15'
                                }`}
                            >
                                <Heart
                                    className={`h-3.5 w-3.5 ${
                                        review.liked ? 'fill-violet-400 text-violet-400' : ''
                                    }`}
                                />
                                {review.likes}
                            </button>

                            <button
                                type="button"
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-black/20 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-white hover:border-white/15 cursor-pointer"
                            >
                                <MessageSquareMore className="h-3.5 w-3.5" />
                                {review.comments}
                            </button>

                            <Link
                                href={`/Reviews/${type}/${Id}/${review.id}`}
                                className="ml-auto text-[11px] font-medium text-violet-500 hover:text-violet-400 transition-colors"
                            >
                                Ver reseña
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            {/* FOOTER */}
            <div className="flex justify-end pt-4">
                <Link
                    href={`/Reviews/${type}/${Id}`}
                    className="text-sm font-medium text-violet-500 hover:text-violet-400 transition-colors"
                >
                    Ver todas las reseñas &rarr;
                </Link>
            </div>

        </section>
    );
};

export default UserReviewsPanel;