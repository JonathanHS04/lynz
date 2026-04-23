import React from "react";
import Link from "next/link";
import { Disc } from "lucide-react";

import { userReviews, artistsPerformance } from "./mockData";
import RatingSquare from "@/components/Rating/RatingSquare";
import BackButton from "@/components/BackButton";
import ReviewsExplorer from "@/components/ReviewsExplorer/ReviewsExplorer";
import { getRatingFont } from "@/utils/getRatingStyle";
import SonicProfile from "@/components/SonicProfile";
import { getSongData } from "@/services/song";

export default async function SongReviewsPage({params}) {
    const resolvedParams = await params;
    const data = await getSongData(resolvedParams.songId, 'basic');

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">

            {/* HERO (más compacto que álbum) */}
            <header className="relative overflow-hidden border-b border-white/5">

                {/* BACKGROUND */}
                <div className="absolute inset-0">
                    <img
                        src={data.image}
                        className="w-full h-full object-cover scale-125 blur-3xl opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                </div>

                {/* CONTENT */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 md:pt-28 pb-4 md:pb-8 w-full">

                    <BackButton />

                    <div className="flex flex-col md:flex-row items-center md:items-center gap-10">

                        {/* COVER */}
                        <div className="shrink-0 rounded-full">
                            <img
                                src={data.image}
                                className="w-36 h-36 md:w-44 md:h-44 rounded-full border border-white/10 shadow-xl"
                            />
                        </div>

                        {/* INFO */}
                        <div className="space-y-4 text-center md:text-left">

                            {/* ARTIST */}
                            <Link
                                href={`/Artist/${data.artistId ?? data.id}`}
                                className="text-sm uppercase tracking-[0.3em] text-zinc-500 font-bold hover:text-violet-400 transition"
                            >
                                {data.artist}
                            </Link>

                            {/* SONG TITLE */}
                            <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight">
                                {data.title}
                            </h1>

                            {/* META */}
                            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start text-sm text-zinc-400">
                                <RatingSquare rating={data.rating} variant="inline" />
                                <span>•</span>
                                <span>{data.duration ?? "3:45"}</span>
                            </div>
                            <div className="flex">

                                {/* OPTIONAL: mini context */}
                                {data.album && (<>
                                    <Disc size={16} className={`${getRatingFont(data.rating)} mr-2`} />
                                    <Link
                                        href={`/Album/${data.albumId ?? data.id}`}
                                        className="text-xs text-zinc-300 hover:text-violet-400 uppercase tracking-widest font-black">
                                        {data.album}
                                    </Link>
                                </>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </header>

            {/* CONTENT (sin sidebar) */}
            <main className="max-w-5xl mx-auto px-4 space-y-8">
                <SonicProfile data={data} metrics={data.sonicProfile} image={false} oneLine={true} header={false} />

                {/* EXPLORER */}
                <ReviewsExplorer
                    userReviews={userReviews}
                    type={"song"}
                    sonicMetrics={data.sonicProfile}
                    artistsPerformance={artistsPerformance}
                    sonicImage={data.image}
                    sonicTitle={data.title}
                    sonicSubtitle={data.artist}
                />

            </main>
        </div>
    );
}