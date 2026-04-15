"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

const artistsData = [
    {
        id: 1,
        name: 'Omar Courtz',
        country: 'Puerto Rico',
        genre: 'Reggaetón / Trap Latino',
        listeners: '12.4M',
        rating: 9.7,
        image: 'https://is1-ssl.mzstatic.com/image/thumb/AMCArtistImages221/v4/f5/7c/21/f57c21d6-590a-b07e-1027-e92e6c62cfe6/ami-identity-cee5abcdd03c2870378144a376dce33d-2025-04-18T00-19-44.218Z_cropped.png/486x486bb.png',
        tags: ['Reggaetón', 'Trap Latino', 'Alt Urbano'],
    },
    {
        id: 2,
        name: 'Twenty One Pilots',
        country: 'Columbus, Ohio',
        genre: 'Alternative Rock / Indie',
        listeners: '39M',
        rating: 9.2,
        image: 'https://i.scdn.co/image/ab6761610000517461a7ea26d33ded218cd1e59d',
        tags: ['Alternative Rock', 'Indie Pop', 'Electropop'],
    },
    {
        id: 3,
        name: 'Bad Gyal',
        country: 'Barcelona, España',
        genre: 'Dancehall / Reggaetón',
        listeners: '8.1M',
        rating: 8.8,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6v5uBzxRFt5jpsC33cGOUhBwB7NTSuoBo7A&s',
        tags: ['Dancehall', 'Reggaetón', 'Pop Urbano'],
    },
];

const allTags = ['Reggaetón', 'Trap Latino', 'Alt Urbano', 'Alternative Rock', 'Indie Pop', 'Electropop', 'Dancehall', 'Pop Urbano'];

export default function ArtistsPage() {
    const [activeTags, setActiveTags] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleTag = (tag) => {
        setActiveTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const clearTags = () => setActiveTags([]);

    const filtered = artistsData.filter(a =>
        activeTags.length === 0 || a.tags.some(t => activeTags.includes(t))
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">Artistas</h1>
                    <p className="text-white/40 text-sm">Explora perfiles, rankings y evolución</p>
                </div>

                {/* Filtros */}
                <div className="relative mb-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setDropdownOpen(prev => !prev)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 hover:text-white hover:border-violet-500/50 transition-all"
                        >
                            Géneros
                            {activeTags.length > 0 && (
                                <span className="bg-violet-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                                    {activeTags.length}
                                </span>
                            )}
                            <span className="text-white/40">{dropdownOpen ? '▲' : '▼'}</span>
                        </button>

                        {activeTags.length > 0 && (
                            <button onClick={clearTags} className="text-xs text-white/30 hover:text-white/60 transition-colors">
                                Limpiar
                            </button>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {activeTags.map(tag => (
                                <span
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-400 text-xs font-semibold cursor-pointer hover:bg-violet-600/30 transition-all"
                                >
                                    {tag} ×
                                </span>
                            ))}
                        </div>
                    </div>

                    {dropdownOpen && (
                        <div className="absolute top-12 left-0 z-20 bg-[#141414] border border-white/10 rounded-2xl p-4 shadow-2xl w-72">
                            <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Selecciona géneros</p>
                            <div className="grid grid-cols-2 gap-2">
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                            activeTags.includes(tag)
                                                ? 'bg-violet-600 text-white'
                                                : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(artist => (
                        <Link key={artist.id} href={`/Artist/${artist.id}`} className="group block">
                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/40 transition-all duration-300">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={artist.image}
                                        alt={artist.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-3 right-3 text-sm font-black text-violet-400 bg-violet-500/20 border border-violet-500/30 rounded-md px-2 py-0.5">
                                        {artist.rating.toFixed(1)}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h2 className="text-lg font-black truncate mb-1">{artist.name}</h2>
                                    <div className="flex items-center gap-2 text-white/40 text-xs mb-3">
                                        <MapPin size={12} />
                                        <span>{artist.country}</span>
                                        <span>·</span>
                                        <span>{artist.listeners} oyentes</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {artist.tags.map(tag => (
                                            <span key={tag} className="text-[10px] text-white/30 bg-white/5 rounded px-2 py-0.5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}