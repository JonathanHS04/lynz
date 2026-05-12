"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const albumsData = [
    {
        id: "22047c46-51da-4762-abd0-e31191e6610f",
        title: "Por si mañana no estoy",
        artist: "Omar Courtz",
        artistId: "61ee1029-4f35-43ce-83dd-2eb8d4eef85e",
        year: "2026",
        type: "Álbum",
        genre: "Urbano / Experimental",
        score: 9.4,
        tracks: 18,
        tags: ['Urbano', 'Experimental', 'Reggaetón'],
        image: "https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg",
    },
    {
        id: "766f3f50-2067-49eb-b2b9-3d231c518be4",
        title: "Primera Musa",
        artist: "Omar Courtz",
        artistId: "61ee1029-4f35-43ce-83dd-2eb8d4eef85e",
        year: "2024",
        type: "EP",
        genre: "Reggaetón",
        score: 9.1,
        tracks: 17,
        tags: ['Reggaetón', 'Urbano'],
        image: "https://i.scdn.co/image/ab67616d00001e02996764071dbd5240eefb2422",
    },
    {
        id: "e992b449-141b-4aea-b07b-9b2a478a8570",
        title: "Un verano sin ti",
        artist: "Bad Bunny",
        artistId: "9cb2e99f-d0ba-4aa5-a371-0006b0d34090",
        year: "2022",
        type: "Álbum",
        genre: "Reggaetón",
        score: 9.0,
        tracks: 23,
        tags: ['Reggaetón', 'Pop Latino'],
        image: "https://i.scdn.co/image/ab67616d00001e0249d694203245f241a1bcaa72",
    },
    {
        id: "b4b95d05-60e3-4d71-82f1-c63dec3a376c",
        title: "Saturno",
        artist: "Rauw Alejandro",
        artistId: "5",
        year: "2022",
        type: "Álbum",
        genre: "Urbano Latino",
        score: 8.8,
        tracks: 18,
        tags: ['Urbano', 'R&B Latino'],
        image: "https://i.scdn.co/image/ab67616d00001e02ee607f4ec65e7c54610be8b1",
    },
    {
        id: "4b550700-6912-4f3b-a804-bac8da786629",
        title: "El último tour del mundo",
        artist: "Bad Bunny",
        artistId: "9cb2e99f-d0ba-4aa5-a371-0006b0d34090",
        year: "2020",
        type: "Álbum",
        genre: "Trap Latino",
        score: 8.7,
        tracks: 16,
        tags: ['Trap Latino', 'Reggaetón'],
        image: "https://i.scdn.co/image/ab67616d00001e02005ee342f4eef2cc6e8436ab",
    },
    {
        id: "cf556b32-6f0c-4d32-9cbb-cc219a20566f",
        title: "Blurryface",
        artist: "Twenty One Pilots",
        artistId: 2,
        year: "2015",
        type: "Álbum",
        genre: "Alternative Rock",
        score: 9.7,
        tracks: 14,
        tags: ['Alternative Rock', 'Indie Pop'],
        image: "https://i.scdn.co/image/ab67616d00001e022df0d98a423025032d0db1f7",
    },
    {
        id: "b2460e22-8948-441a-b894-f031b57d4231",
        title: "Trench",
        artist: "Twenty One Pilots",
        artistId: "a6c6897a-7415-4f8d-b5a5-3a5e05f3be67",
        year: "2018",
        type: "Álbum",
        genre: "Alternative Rock",
        score: 9.3,
        tracks: 14,
        tags: ['Alternative Rock', 'Electropop'],
        image: "https://i.scdn.co/image/ab67616d00001e02d1d301e737da4324479c6660",
    },
    {
        id: "dbecf03e-18ab-4d35-8371-a30c1dc356ba",
        title: "Clancy",
        artist: "Twenty One Pilots",
        artistId: "a6c6897a-7415-4f8d-b5a5-3a5e05f3be67",
        year: "2024",
        type: "Álbum",
        genre: "Alternative Rock",
        score: 8.9,
        tracks: 13,
        tags: ['Alternative Rock', 'Indie Pop'],
        image: "https://i.scdn.co/image/ab67616d00001e02cc94dd4730132ccfbd617bf9",
    },
    {
        id: "7d1a547f-e58e-4601-b682-300e39a4aa18",
        title: "Breach",
        artist: "Twenty One Pilots",
        artistId: "a6c6897a-7415-4f8d-b5a5-3a5e05f3be67",
        year: "2025",
        type: "Álbum",
        genre: "Alternative Rock",
        score: 9.0,
        tracks: 13,
        tags: ['Alternative Rock', 'Electropop'],
        image: "https://i.scdn.co/image/ab67616d00001e029c5a3160cc1a6ef5efdaf80a",
    },
];

const allTags = ['Reggaetón', 'Urbano', 'Experimental', 'Trap Latino', 'Pop Latino', 'R&B Latino', 'Alternative Rock', 'Indie Pop', 'Electropop'];

export default function AlbumsPage() {
    const [activeTags, setActiveTags] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleTag = (tag) => {
        setActiveTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const clearTags = () => setActiveTags([]);

    const filtered = albumsData.filter(a =>
        activeTags.length === 0 || a.tags.some(t => activeTags.includes(t))
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-5xl font-black tracking-tighter uppercase mb-2">Álbumes</h1>
                    <p className="text-white/40 text-sm">Sumérgete en proyectos completos</p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map(album => (
                        <Link key={album.id} href={`/Album/${album.id}`} className="group block">
                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/40 transition-all duration-300">
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={album.image}
                                        alt={album.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3 text-sm font-black text-violet-400 bg-black/70 border border-violet-500/30 rounded-md px-2 py-0.5">
                                        {album.score.toFixed(1)}
                                    </div>
                                    <div className="absolute top-3 left-3 text-xs font-bold text-white/60 bg-black/60 rounded px-2 py-0.5">
                                        {album.type}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h2 className="text-sm font-black truncate mb-1">{album.title}</h2>
                                    <p className="text-white/40 text-xs truncate mb-2">{album.artist} · {album.year}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/30 text-xs">{album.tracks} canciones</span>
                                        <span className="text-white/30 text-xs bg-white/5 rounded px-2 py-0.5">{album.genre}</span>
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