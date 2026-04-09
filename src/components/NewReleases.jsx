import React from 'react';
import ReleaseCard from './ReleaseCard';

const releases = [
  { id: 101, type: "album", title: "Eternal Sunshine", artist: "Ariana Grande", rating: 9.4,  year: 2026, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop" },
  { id: 102, type: "album", title: "Blue Lips", artist: "Schoolboy Q", rating: 8.2, year: 2026, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop" },
  { id: 103, type: "album", title: "Las Mujeres Ya No Lloran", artist: "Shakira", rating: 7.4, year: 2026, image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2069&auto=format&fit=crop" },
  { id: 104, type: "album", title: "De Camino a Hermes", artist: "Rels B", rating: 9.0, year: 2026, image: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=2079&auto=format&fit=crop" },
]

const NewReleases = ({author}) => {
  return (
    <section className="py-4 bg-[#0a0a0a]">
        
        {/* Header con estética minimalista */}
        <div className="flex items-end justify-between mb-10 border-b border-white/5">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter mt-1">Nuevos Lanzamientos</h2>
          </div>
        </div>

        {/* Grid System: Sin scrollbars molestos, adaptable a pantallas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
          {releases.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              {/* Card de Álbum */}
              <ReleaseCard release={item} author={author} />

            </div>
          ))}
        </div>
    </section>
  );
};

export default NewReleases;