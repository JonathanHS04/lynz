import React from "react";
import Link from "next/link";
import { Disc } from "lucide-react";

import { userReviews } from "./mockData";
import RatingSquare from "@/components/Rating/RatingSquare";
import BackButton from "@/components/BackButton";
import ReviewsExplorer from "@/components/ReviewsExplorer/ReviewsExplorer";
import { getRatingFont } from "@/utils/getRatingStyle";
import SonicProfile from "@/components/SonicProfile";
import { getSongData } from "@/services/song";
import RatingAndQuickActions from "@/components/Rating/RatingAndQuickActions";

export default async function SongReviewsPage({params, searchParams}) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const songData = await getSongData(resolvedParams.songId, 'basic');
    const shouldOpenRating = resolvedSearchParams?.rate === '1';

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">

            {/* HERO (más compacto que álbum) */}
            <header className="relative overflow-hidden border-b border-white/5">

                {/* BACKGROUND */}
                <div className="absolute inset-0">
                    <img
                        src={songData.image}
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
                                src={songData.image}
                                className="w-36 h-36 md:w-44 md:h-44 rounded-full border border-white/10 shadow-xl"
                            />
                        </div>

                        {/* INFO */}
                        <div className="space-y-4 text-center md:text-left">

                            {/* ARTIST */}
                            <Link
                                href={`/Artist/${songData.artistId ?? songData.id}`}
                                className="text-sm uppercase tracking-[0.3em] text-zinc-500 font-bold hover:text-violet-400 transition"
                            >
                                {songData.artist}
                            </Link>

                            {/* SONG TITLE */}
                            <h1 className="text-4xl md:text-6xl font-black uppercase leading-tight">
                                {songData.title}
                            </h1>

                            {/* META */}
                            <RatingAndQuickActions rating={songData.rating} ratingHref={`/Reviews/Song/${songData.id}`} links={songData.externalLinks} type="review" initialModalOpen={shouldOpenRating} modalData={{
                                title: songData.title,
                                image: songData.image,
                                artist: songData.artist,
                                artistId: songData.artistId,
                                sonicProfile: songData.sonicProfile,
                                artistPerformance: songData.artistPerformance,
                                features: songData.features,
                            }} />
                            <div className="flex">

                                {/* OPTIONAL: mini context */}
                                {songData.album && (<>
                                    <Disc size={16} className={`${getRatingFont(songData.rating)} mr-2`} />
                                    <Link
                                        href={`/Album/${songData.albumId ?? songData.id}`}
                                        className="text-xs text-zinc-300 hover:text-violet-400 uppercase tracking-widest font-black">
                                        {songData.album}
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
                <SonicProfile data={songData} metrics={songData.sonicProfile} image={false} oneLine={true} header={false} />

                {/* EXPLORER */}
                <ReviewsExplorer
                    userReviews={userReviews}
                    type={"song"}
                    sonicMetrics={songData.sonicProfile}
                    artistsPerformance={songData.artistsPerformance}
                    sonicImage={songData.image}
                    sonicTitle={songData.title}
                    sonicSubtitle={songData.artist}
                />

            </main>
        </div>
    );
}