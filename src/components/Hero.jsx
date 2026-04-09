"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRatingFont, getRatingBorder } from '@/utils/getRatingStyle'; 

const Hero = ({ featuredAlbum, featuredSong }) => {
  const [activeTab, setActiveTab] = useState('album'); 
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsExiting(true);
      setTimeout(() => {
        setActiveTab((prev) => (prev === 'album' ? 'song' : 'album'));
        setIsExiting(false);
      }, 500); 
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const current = activeTab === 'album' ? featuredAlbum : featuredSong;
  
  // Clases dinámicas
  const textColor = getRatingFont(current.score);
  const borderStyle = getRatingBorder(current.score);

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-end pb-20 overflow-hidden">
      {/* Background Section (Sin cambios) */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
        <img src={current.image} alt="Hero Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0a0a0a]/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
      </div>

      <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full transition-all duration-500 ${isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
        
        {/* Tab Indicators */}
        <div className="flex gap-2 mb-4">
          <div className={`h-0.5 rounded-full transition-all duration-500 ${activeTab === 'album' ? 'w-8 bg-violet-500' : 'w-4 bg-white/20'}`} />
          <div className={`h-0.5 rounded-full transition-all duration-500 ${activeTab === 'song' ? 'w-8 bg-violet-500' : 'w-4 bg-white/20'}`} />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black text-gray-200 tracking-[0.2em] mb-4 uppercase">
              {activeTab === 'album' ? 'Álbum de la semana' : 'Canción de la semana'}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter uppercase leading-none">
              {activeTab === 'album' ? current.album : current.title}
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 mb-8 font-medium">
              por <span className="text-white">{current.artist}</span>
            </p>
            
            <Link 
              href={activeTab === 'album' ? `/Album/${current.id}` : `/Song/${current.id}`} 
              className="px-10 py-4 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full hover:bg-violet-500 hover:text-white transition-all duration-300 transform hover:scale-105 inline-block shadow-xl shadow-black/20">
              {activeTab === 'album' ? 'Explorar Album' : 'Explorar Canción'}
            </Link>
          </div>
          
          {/* Círculo de Score con el "Borde de antes" */}
          <div className={`
              flex flex-col items-center justify-center w-36 h-36 rounded-full 
              border-4 bg-[#0a0a0a]/90 backdrop-blur-xl shrink-0
              transition-all duration-500 transform hover:scale-110
              ${borderStyle}
            `}
          >
            <span className={`text-5xl font-black tracking-tighter ${textColor}`}>
              {current.score.toFixed(1)}
            </span>
            <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mt-1">
              Score
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;