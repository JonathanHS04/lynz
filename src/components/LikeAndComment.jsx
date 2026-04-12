"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageSquareMore } from 'lucide-react';
import { getRatingFont } from '@/utils/getRatingStyle';


const LikeAndComment = ({ review, reviewState, setReviewState }) => {
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
        <>
            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    toggleLike(review.id);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition-colors cursor-pointer ${review.liked
                        ? 'border-violet-500/50 bg-violet-500/10 text-violet-300'
                        : 'border-white/8 bg-black/20 text-zinc-400 hover:text-white hover:border-white/15'
                    }`}
            >
                <Heart
                    className={`h-3.5 w-3.5 ${review.liked ? 'fill-violet-400 text-violet-400' : ''
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
        </>
    )
}

export default LikeAndComment