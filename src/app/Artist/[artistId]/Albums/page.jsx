import React from 'react'
import { artistData } from '../mockData';
import ArtistHero from '../components/ArtistHero';
import BackButton from '@/components/BackButton';
import Releases from '../components/Releases';

const page = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
        <ArtistHero artistData={artistData} />
        <main id="artist-releases" className="max-w-7xl mx-auto px-6 py-14 space-y-14">
            <BackButton />
            <Releases artistId={artistData.id} releases={artistData.releases} sectionLabel={'text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500'} size={"large"} />
        </main>
            
        
    </div>
    
  )
}

export default page;