import React from 'react';
import Tracklist from '@/components/Tracklist';
import SonicProfile from '@/components/SonicProfile';
import Profile from '@/components/Profile';
import { artistData } from './mockData';
import Releases from './components/Releases';
import ArtistHero from './components/ArtistHero';

const sectionLabel = 'text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500';


export default function ArtistPage() {


    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">

            <ArtistHero artistData={artistData} />


            <main className="max-w-7xl mx-auto px-6 py-14 space-y-14">

                <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">

                    <div className="space-y-12">


                        <Releases artistId={artistData.id} releases={artistData.releases} sectionLabel={sectionLabel} />


                        {/* TRACKLIST */}
                        <section className="rounded-3xl p-6">
                            <div className="mb-6">
                                <p className={sectionLabel}>Popular</p>
                                <h2 className="text-3xl font-black">Top Tracks</h2>
                            </div>

                            <Tracklist
                                tracks={artistData.topTracks}
                                images={true}
                            />
                        </section>

                    </div>


                    <aside className="space-y-8 lg:top-24 self-start">
                        <h2 className='text-3xl font-black'>Biografía</h2>

                        <Profile data={artistData} />

                        <SonicProfile data={artistData} metrics={artistData.sonicProfile} image={false} />


                    </aside>

                </section>

            </main>
        </div>
    );
}