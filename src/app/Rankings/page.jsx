"use client";

import React from 'react';
import Link from 'next/link';

const rankingsData = {
    albums: [
        { rank: 1, prev: 1, id: 101, title: "Por si mañana no estoy", artist: "Omar Courtz", artistId: 1, genre: "Urbano / Experimental", score: 9.4, image: "https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg" },
        { rank: 2, prev: 4, id: 102, title: "Primera Musa", artist: "Omar Courtz", artistId: 1, genre: "Reggaetón", score: 9.1, image: "https://i.scdn.co/image/ab67616d00001e02996764071dbd5240eefb2422" },
        { rank: 3, prev: 2, id: 103, title: "Un verano sin ti", artist: "Bad Bunny", artistId: 2, genre: "Reggaetón", score: 9.0, image: "https://i.scdn.co/image/ab67616d00001e0249d694203245f241a1bcaa72" },
        { rank: 4, prev: 3, id: 104, title: "Saturno", artist: "Rauw Alejandro", artistId: 3, genre: "Urbano Latino", score: 8.8, image: "https://i.scdn.co/image/ab67616d00001e02ee607f4ec65e7c54610be8b1" },
        { rank: 5, prev: 5, id: 105, title: "El último tour del mundo", artist: "Bad Bunny", artistId: 2, genre: "Trap Latino", score: 8.7, image: "https://i.scdn.co/image/ab67616d00001e02005ee342f4eef2cc6e8436ab" },
        { rank: 6, prev: 8, id: 106, title: "Yhlqmdlg", artist: "Bad Bunny", artistId: 2, genre: "Reggaetón", score: 8.5, image: "https://i.scdn.co/image/ab67616d00001e02548f7ec52da7313de0c5e4a0" },
    ],
    songs: [
        { rank: 1, prev: 2, id: 15, title: "COMERNOS", artist: "Omar Courtz ft. Bad Gyal", artistId: 1, genre: "Reggaetón / Exp.", score: 9.9, image: "https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg" },
        { rank: 2, prev: 1, id: 13, title: "WO OH OH", artist: "Omar Courtz ft. ROA", artistId: 1, genre: "Urbano", score: 9.7, image: "https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg" },
        { rank: 3, prev: 3, id: 10, title: "Dulces SueñoZzz", artist: "Omar Courtz ft. Rubí", artistId: 1, genre: "Experimental", score: 9.6, image: "https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg" },
        { rank: 4, prev: 6, id: 3,  title: "FOREVER TU GANTEL", artist: "Omar Courtz ft. Ñengo Flow", artistId: 1, genre: "Trap", score: 9.5, image: "https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg" },
        { rank: 5, prev: 4, id: 9,  title: "SI ESTÁS CON ALGUIEN", artist: "Omar Courtz", artistId: 1, genre: "Urbano", score: 9.3, image: "https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg" },
        { rank: 6, prev: 5, id: 2,  title: "EL MUNDO SE VA A ACABAR", artist: "Omar Courtz ft. KARBeats", artistId: 1, genre: "Experimental", score: 9.2, image: "https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg" },
    ]
};

const genres = ['Todos', 'Reggaetón', 'Trap', 'Urbano Latino', 'Trap Latino', 'Experimental'];

function Trend({ rank, prev }) {
    const diff = prev - rank;
    if (diff > 0) return <span className="text-emerald-400 text-xs font-bold">▲ {diff}</span>;
    if (diff < 0) return <span className="text-red-400 text-xs font-bold">▼ {Math.abs(diff)}</span>;
    return <span className="text-white/20 text-xs font-bold">— —</span>;
}

function RankingCard({ item, type }) {
    const href = type === 'albums' ? `/Album/${item.id}` : `/Song/${item.id}`;
    const isTop3 = item.rank <= 3;

    return (
        <Link href={href} className="group relative rounded-2xl overflow-hidden block h-52 cursor-pointer">
            <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className={`text-xs font-black tracking-widest mb-1 ${isTop3 ? 'text-violet-400' : 'text-white/40'}`}>
                    #{item.rank}
                </div>
                <div className="text-white font-black text-base leading-tight truncate">{item.title}</div>
                <div className="text-white/50 text-xs mb-2 truncate">{item.artist}</div>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-violet-400 bg-violet-500/20 border border-violet-500/30 rounded-md px-2 py-0.5">
                        {item.score.toFixed(1)}
                    </span>
                    <span className="text-white/70 text-xs bg-black/60 rounded px-2 py-0.5">{item.genre}</span>
                    <Trend rank={item.rank} prev={item.prev} />
                </div>
            </div>
        </Link>
    );
}

export default function RankingsPage() {
    const [activeTab, setActiveTab] = React.useState('albums');
    const [activeGenre, setActiveGenre] = React.useState('Todos');
    const items = rankingsData[activeTab].filter(item =>
      activeGenre === 'Todos' || item.genre.toLowerCase().includes(activeGenre.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">Rankings</h1>
                    <p className="text-white/40 text-sm">
                        {activeTab === 'albums'
                            ? 'Los álbumes mejor valorados por la comunidad Lynz'
                            : 'Las canciones mejor valoradas por la comunidad Lynz'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit mb-10">
                    {['albums', 'songs'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                activeTab === tab
                                    ? 'bg-violet-600 text-white'
                                    : 'text-white/40 hover:text-white/70'
                            }`}
                        >
                            {tab === 'albums' ? 'Álbumes' : 'Canciones'}
                        </button>
                    ))}
                </div>

              
                <div className="flex flex-wrap gap-2 mb-8">
                    {genres.map(genre => (
                        <button
                            key={genre}
                            onClick={() => setActiveGenre(genre)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                                activeGenre === genre
                                    ? 'bg-violet-600 text-white'
                                    : 'bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10'
                            }`}
                        >
                            {genre}
                        </button>
                    ))}
                </div>






                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                        <RankingCard key={item.id} item={item} type={activeTab} />
                    ))}
                </div>
            </div>
        </div>
    );
}