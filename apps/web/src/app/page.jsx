import React from 'react';
import Hero from '@/app/components/Hero';
import ExploreHub from '@/app/components/ExploreHub';
import RotatingReviewSpotlight from '@/components/RotatingReviewSpotlight';

import {
  featuredAlbum,
  featuredSong,
  recentReviews,
} from './templateData';
import ReviewsHub from './components/ReviewsHub';

const sectionLabel = 'text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-violet-500/30 selection:text-violet-200">
      <main>
        <Hero featuredAlbum={featuredAlbum} featuredSong={featuredSong} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
          <div className="space-y-14 md:space-y-16">

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.08fr)_340px] lg:gap-16 items-start">              <div className="space-y-12">
              <ExploreHub />
            </div>

              <aside className="space-y-8 flex">
                <ReviewsHub />
              </aside>

            </div>

          </div>
        </div>
        
      </main>
    </div>
  );
}