import React from 'react';
import Link from 'next/link';
import Tracklist from '@/components/Tracklist';
import RatingAndQuickActions from '@/components/Rating/RatingAndQuickActions';
import RankingInfo from '@/components/RankingInfo';
import UserReviewsPanel from '@/components/UserReviewsPanel';
import SonicProfile from '@/components/SonicProfile';
import { formatTotalDuration } from '@/utils/formatTime';
import { getAlbumData } from '@/services/album';

export default async function AlbumPage({params}) {
    const resolvedParams = await params;
    const albumData = await getAlbumData(resolvedParams.albumId);

    if (!albumData) {
        return <div className="min-h-screen bg-[#0a0a0a] text-white">Album not found</div>;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white py-12">

            {/* --- HERO SECTION --- */}
            <header className="relative min-h-[430px] h-[60vh] flex items-end overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={albumData.image}
                        className="w-full h-full object-cover scale-110 blur-3xl opacity-30"
                        alt="Blur background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 z-10">
                    <div className="flex flex-col md:flex-row gap-8 items-end">
                        <div className="shrink-0 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden border border-white/10 w-64 h-64 md:w-80 md:h-80 transition-transform hover:scale-[1.02] duration-500">
                            <img src={albumData.image} className="w-full h-full object-cover" alt={albumData.title} />
                        </div>

                        <div className="flex-1 space-y-5">
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                                {albumData.title}
                            </h1>

                            <div className="flex items-center gap-4 text-gray-400 font-medium">
                                <Link href={`/Artist/${albumData.artistId}`} className="cursor-pointer transition-colors text-lg text-white font-bold hover:text-violet-500">{albumData.artist}</Link>
                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                <span className="text-sm uppercase tracking-wider">{albumData.genre}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                <span className="text-sm">{albumData.releaseYear} • {albumData.tracks.length} canciones • {formatTotalDuration(albumData.duration)}</span>
                            </div>
                            <RatingAndQuickActions rating={albumData.rating} ratingHref={`/Reviews/Album/${albumData.id}`} links={albumData.externalLinks}/>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- CONTENT SECTION --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <Tracklist tracks={albumData.tracks}/>
                    <aside className="space-y-12">
                        <SonicProfile data={albumData} metrics={albumData.sonicProfile} image={false}/>
                        <RankingInfo rankings={albumData.rankings} />
                        <UserReviewsPanel reviews={albumData.userReviews} Id={albumData.id} type="Album" />
                    </aside>
                </div>
            </main>
        </div>
    );
}