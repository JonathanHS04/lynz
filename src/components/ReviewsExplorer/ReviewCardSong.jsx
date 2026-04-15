import React from 'react'
import Link from 'next/link';
import { formatRelativeTime } from '@/utils/formatTime';
import { ArrowUpRight } from 'lucide-react';
import RatingSquare from '@/components/Rating/RatingSquare';
import LikeAndComment from '@/components/LikeAndComment';


const ReviewCardSong = ({ review, reviewsState, setReviewsState }) => {
    return (
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.05]">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div className="flex gap-3">

                    <img
                        src={review.avatar}
                        className="w-10 h-10 rounded-full border border-white/10"
                    />

                    <div>
                        <p className="font-black text-sm">
                            {review.username}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                            {formatRelativeTime(review.date)}
                        </p>
                    </div>
                </div>

                <RatingSquare rating={review.rating} variant="inline" />
            </div>

            {/* TEXTO (más visible que en álbum) */}
            <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
                {review.text}
            </p>

            {/* FOOTER */}
            <div className="mt-4 flex items-center">
                <LikeAndComment
                    review={review}
                    reviewState={reviewsState}
                    setReviewState={setReviewsState}
                />
            </div>
        </article>
    );
};

export default ReviewCardSong