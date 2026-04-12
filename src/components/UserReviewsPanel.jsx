"use client"
import React from 'react';
import Link from 'next/link';
import { Heart, MessageSquareMore, Star } from 'lucide-react';
import { getRatingFont } from '@/utils/getRatingStyle';
import RatingSquare from './RatingSquare';
import LikeAndComment from './LikeAndComment';
import { useState } from 'react';

const UserReviewsPanel = ({ reviews = [], type, Id }) => {

    const [reviewState, setReviewState] = useState(
        reviews.map((review) => ({
            ...review,
            liked: false,
        }))
    );

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
                            <RatingSquare rating={review.rating} variant="review" />
                        </div>

                        {/* TEXTO */}
                        <p className="mt-3 text-sm leading-relaxed text-zinc-300/85 line-clamp-2">
                            {review.text}
                        </p>

                        {/* ACCIONES */}
                        <div className="mt-3 flex items-center gap-2">
                            <LikeAndComment review={review} reviewState={reviewState} setReviewState={setReviewState} />

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
                    className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/20 px-4 py-2 text-sm font-bold text-violet-300 hover:bg-violet-500/20 hover:text-white transition-all"
                >
                    Ver todas las reseñas
                </Link>
            </div>

        </section>
    );
};

export default UserReviewsPanel;