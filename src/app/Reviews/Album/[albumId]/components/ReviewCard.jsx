import React from 'react'
import Link from 'next/link';
import { formatRelativeTime } from '@/utils/formatTime';
import { ArrowUpRight } from 'lucide-react';
import RatingSquare from '@/components/RatingSquare';
import LikeAndComment from '@/components/LikeAndComment';



const ReviewCard = ({ review, reviewsState, setReviewsState, albumId, router }) => {
    return (
        <article
            key={review.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition"
        >
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div className="flex gap-3">
                    <Link href={`/User/${review.username}`}>
                        <img
                            src={review.avatar}
                            className="w-12 h-12 rounded-full border border-white/10"
                        />
                    </Link>

                    {/* Cambia esto dentro de tu paginatedReviews.map */}
                    <div>
                        <Link className="font-black hover:underline" href={`/User/${review.username}`}>
                            {review.username}
                        </Link>
                        <p className="text-xs text-zinc-500">
                            {/* Aquí la magia: pasamos la fecha real a formato relativo */}
                            {formatRelativeTime(review.date)}
                        </p>
                    </div>
                </div>

                <RatingSquare rating={review.rating} variant="inline" />
            </div>

            {/* TEXTO (truncate) */}
            <p className="mt-4 text-zinc-300 leading-relaxed line-clamp-3">
                {review.text}
            </p>

            {/* FOOTER */}
            <div className="mt-5 flex items-end justify-between">

                <div className="flex items-center gap-3">
                    <LikeAndComment review={review} reviewState={reviewsState} setReviewState={setReviewsState} />
                </div>

                <button
                    onClick={() =>
                        router.push(`/Reviews/Album/${albumId}/${review.id}`)
                    }
                    className="group relative cursor-pointer inline-flex items-center gap-2 overflow-hidden rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-300 transition-all hover:bg-violet-500/20 hover:text-white active:scale-95"
                >
                    {/* glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-violet-500/20 blur-xl" />

                    <span className="relative z-10 tracking-wide">
                        Ver reseña completa
                    </span>

                    <ArrowUpRight className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
            </div>
        </article>
    )
}

export default ReviewCard