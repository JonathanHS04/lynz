"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Users, Disc3, Music2, X } from "lucide-react";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [type, setType] = useState("Songs");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    const types = [
        
        { id: 'Songs', label: 'Canción', icon: Music2 },
        { id: 'Albums', label: 'Álbum', icon: Disc3 },
        { id: 'Artists', label: 'Artista', icon: Users },
        
    ];

    const currentType = types.find(t => t.id === type);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        const cleanQuery = query.trim();
        if (!cleanQuery) return;

        const params = new URLSearchParams();
        params.set('q', cleanQuery);

        router.push(`/Search/${type}?${params.toString()}`);
        setIsMobileSearchOpen(false);
    };

    return (
        <div className="flex items-center gap-4">
            {/* --- DESKTOP SEARCH --- */}
            <form
                onSubmit={handleSearch}
                className="hidden sm:flex items-center bg-[#0f0f0f] border border-white/10 rounded-full p-1 focus-within:border-violet-500/50 transition-all shadow-inner"
            >
                {/* Dropdown con contraste */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border border-white/10 ${isDropdownOpen
                                ? 'bg-[#2a2a2a] text-white border-white/10 shadow-lg'
                                : 'bg-[#1e1e1e] text-zinc-400 hover:text-white'
                            }`}
                    >
                        <currentType.icon className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{currentType.label}</span>
                        <ChevronDown className={`w-3 h-3 opacity-50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Menú Flotante */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-44 bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.7)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                            <div className="p-1">
                                {types.map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => {
                                            setType(t.id);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors ${type === t.id
                                                ? 'bg-violet-600 text-white'
                                                : 'text-zinc-500 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <t.icon className="w-4 h-4" />
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Input con padding lateral para no pegarse al dropdown */}
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Buscar ${currentType.label.toLowerCase()}...`}
                    className="bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none px-4 w-48 md:w-64"
                />

                <button type="submit" className="mr-3 p-2 text-zinc-500 hover:text-violet-400 transition-colors">
                    <Search className="w-4 h-4" />
                </button>
            </form>

            {/* --- MOBILE --- */}
            <button
                onClick={() => setIsMobileSearchOpen(true)}
                className="sm:hidden p-2 bg-[#1e1e1e] rounded-full text-zinc-400"
            >
                <Search className="w-5 h-5" />
            </button>

            {isMobileSearchOpen && (
                <div className="fixed inset-0 z-[60] bg-[#0a0a0a] sm:hidden p-6 animate-in slide-in-from-bottom duration-300">
                    <div className="flex justify-end mb-8">
                        <button onClick={() => setIsMobileSearchOpen(false)} className="p-2 text-zinc-400">
                            <X className="w-8 h-8" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">¿Qué quieres buscar?</p>

                        <div className="grid grid-cols-3 gap-2">
                            {types.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setType(t.id)}
                                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${type === t.id
                                            ? 'border-violet-500 bg-violet-500/10 text-white'
                                            : 'border-white/5 bg-white/5 text-zinc-500'
                                        }`}
                                >
                                    <t.icon className="w-6 h-6" />
                                    <span className="text-[10px] font-bold uppercase">{t.label}</span>
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSearch} className="relative pt-4">
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Escribe aquí..."
                                className="w-full bg-[#1e1e1e] rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-violet-500"
                            />
                            <button type="submit" className="absolute right-3 top-[calc(50%+8px)] -translate-y-1/2 bg-violet-600 p-2 rounded-xl">
                                <Search className="w-5 h-5 text-white" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;