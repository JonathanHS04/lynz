"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquareMore, Star } from "lucide-react";

import { songData, userReviews } from "./mockData";
import RatingSquare from "@/components/RatingSquare";
import LikeAndComment from "@/components/LikeAndComment";
import BackButton from "@/components/BackButton";
import ReviewsExplorer from "../components/ReviewsExplorer";
import { getRatingFont } from "@/utils/getRatingStyle";

export default function SongReviewsPage() {
    const data = songData;

    const [reviewsState, setReviewsState] = useState(
        userReviews.map((r) => ({ ...r, liked: false }))
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">

            {/* HERO (más compacto que álbum) */}
            <header className="relative h-[40vh] flex items-end border-b border-white/5 overflow-hidden">

                {/* bg */}
                <div className="absolute inset-0">
                    <img
                        src={data.image}
                        className="w-full h-full object-cover scale-150 blur-3xl opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                </div>

                <div className="max-w-5xl mx-auto px-4 pb-8 w-full z-10">

                    <BackButton />

                    <div className="flex items-center gap-5">

                        {/* cover más pequeño */}
                        <img
                            src={data.image}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-xl border border-white/10"
                        />

                        <div className="space-y-2">

                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                                Canción
                            </p>

                            <h1 className="text-2xl md:text-4xl font-black uppercase leading-tight">
                                {data.title}
                            </h1>

                            <Link
                                href={`/Artist/${data.artistId}`}
                                className="text-sm text-zinc-400 hover:text-violet-400 font-bold"
                            >
                                {data.artist}
                            </Link>

                            <div className="flex items-center gap-4 text-sm text-zinc-400">
                                <RatingSquare rating={data.rating} variant="inline" />
                                <span>{reviewsState.length} reseñas</span>
                            </div>

                        </div>
                    </div>
                </div>
            </header>

            {/* CONTENT (sin sidebar) */}
            <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">

                {/* HEADER SIMPLE */}
                <div className="flex items-center gap-3">
                    <MessageSquareMore className="text-violet-400 w-5 h-5" />
                    <h2 className="text-xl font-black uppercase">
                        Reseñas de la canción
                    </h2>
                </div>

                {/* EXPLORER */}
                <ReviewsExplorer
                    reviewsState={reviewsState}
                    setReviewsState={setReviewsState}
                />

            </main>
        </div>
    );
}