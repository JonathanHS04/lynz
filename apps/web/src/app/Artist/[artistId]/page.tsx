import React from 'react';
import Tracklist from '@/components/Tracklist/Tracklist';
import SonicProfileDashboard from '@/components/SonicProfileDashboard';
import Releases from './components/Releases';
import ArtistHero from './components/ArtistHero';
import RankingInfo from '@/components/RankingInfo';
import { getArtistData } from '@/services/artist';

const sectionLabel = 'text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500';


export default async function ArtistPage({params}) {
    const resolvedParams = await params;
    let artistData = null;

    try {
        artistData = await getArtistData(resolvedParams.artistId);
    } catch (error) {
        console.error("Error loading artist page:", error);
    }

    console.log("Artist Data:", artistData); // Log para verificar la estructura de los datos

    if (!artistData) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white grid place-items-center px-6">
                <div className="max-w-md text-center space-y-3">
                    <p className={sectionLabel}>Artista</p>
                    <h1 className="text-3xl font-black">No se pudo cargar el artista</h1>
                    <p className="text-sm text-zinc-400">
                        MusicBrainz no respondió a tiempo. Intenta recargar en unos segundos.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">

            <ArtistHero artistData={artistData} />

            <main className="max-w-7xl mx-auto px-6 py-14 space-y-14">

                <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">

                    <div className="space-y-12">


                        <Releases artistId={artistData.id} releases={artistData.releases} sectionLabel={sectionLabel} />


                        {/* TRACKLIST 
                        <section className="rounded-3xl p-6">
                            <div className="mb-6">
                                <p className={sectionLabel}>Popular</p>
                                <h2 className="text-3xl font-black">Top Tracks</h2>
                            </div>

                            <Tracklist
                                tracks={artistData.topTracks}
                                images={true}
                            />
                        </section>*/}

                    </div>


                    <aside className="space-y-8 lg:top-24 self-start">

                        <SonicProfileDashboard data={artistData} sonicProfile={artistData.sonicProfile} image={false} />
                        <RankingInfo rankings={artistData.rankings} />

                    </aside>
                </section>
            </main>
        </div>
    );
}
