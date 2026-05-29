import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import { getRatingFont } from "@/utils/getRatingStyle";
import { userReviews } from "./mockData";
import RatingSquare from "@/components/Rating/RatingSquare";
import BackButton from "@/components/BackButton";
import SonicProfileDashboard from "@/components/SonicProfileDashboard";
import ReviewsExplorer from "@/components/ReviewsExplorer/ReviewsExplorer";
import { getAlbumData } from "@/services/album";
import RatingAndQuickActions from "@/components/Rating/RatingAndQuickActions";

export default async function ReviewsPage({params, searchParams}) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const data = await getAlbumData(resolvedParams.albumId);
    const shouldOpenRating = resolvedSearchParams?.rate === '1';

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">

            {/* HERO */}
            <header className="relative h-[60vh] flex items-end overflow-hidden border-b border-white/5">
                <div className="absolute inset-0">
                    <img
                        src={data.image}
                        className="w-full h-full object-cover scale-150 blur-3xl opacity-20"
                        alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-4 pb-10 w-full z-10">

                    <BackButton />

                    <div className="flex items-end gap-6 flex-wrap">
                        <img
                            src={data.image}
                            className="w-38 h-38 md:w-50 md:h-50 rounded-2xl border border-white/10"
                            alt={data.name}
                        />

                        <div className="space-y-3">
                            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                                Álbum
                            </p>

                            <h1 className="text-4xl md:text-6xl font-black uppercase">
                                {data.name}
                            </h1>

                            <p className="text-white/70">
                                <Link href={`/Artist/${data.id}`} className="hover:text-violet-400 font-black">
                                    {data.artists[0]?.name || "Desconocido"}
                                </Link>
                            </p>

                            <RatingAndQuickActions
                                type={"album"}
                                initialModalOpen={shouldOpenRating}
                                data={data}
                                isReview={true}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* CONTENT */}
            <main className="max-w-7xl mx-auto px-4 py-12">

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">

                    {/* IZQUIERDA */}
                    <div className="space-y-8">
                        <ReviewsExplorer userReviews={userReviews} type={"album"}/>
                    </div>

                    {/* SIDEBAR */}
                    <aside className="space-y-6">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                            <h3 className="text-m text-white font-black tracking-tight mb-4">Resumen</h3>

                            <div className="flex justify-between">
                                <span className="text-zinc-400">Rating</span>
                                <div className="flex items-center gap-1">
                                    <Star className={`w-4 h-4 ${getRatingFont(data.rating)} fill-current`} />
                                    <span className={`font-black ${getRatingFont(data.rating)}`}>
                                        {data.rating}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between mt-2">
                                <span className="text-zinc-400">Reseñas</span>
                                <span>{userReviews.length}</span>
                            </div>
                        </div>
                            <SonicProfileDashboard data={data} sonicProfile={data.sonicProfile} image={false} header={false} />
                    </aside>
                </div>
            </main>
        </div>
    );
}