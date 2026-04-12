"use client";

import { Search, Menu, User, Disc3, Mic2, Music2, Users, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { searchMockData } from "@/app/searchMockData";

const resultTypeStyles = {
  artist: { label: "Artista", icon: Users },
  album: { label: "Álbum", icon: Disc3 },
  song: { label: "Canción", icon: Music2 },
  user: { label: "Usuario", icon: Mic2 },
};

const recentSearches = [
  searchMockData[0],
  searchMockData[4],
  searchMockData[7],
  searchMockData[2],
];

function normalizeValue(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getSearchScore(item, query) {
  const normalizedQuery = normalizeValue(query);
  if (!normalizedQuery) return 0;

  const title = normalizeValue(item.title);
  const subtitle = normalizeValue(item.subtitle);
  const meta = normalizeValue(item.meta);

  let score = 0;

  if (title === normalizedQuery) score += 120;
  if (title.startsWith(normalizedQuery)) score += 80;
  if (title.includes(normalizedQuery)) score += 55;
  if (subtitle.includes(normalizedQuery)) score += 20;
  if (meta.includes(normalizedQuery)) score += 10;

  return score;
}

function SearchResultItem({ item, onSelect }) {
  const typeConfig = resultTypeStyles[item.type];
  const TypeIcon = typeConfig.icon;
  const isPerson = item.type === "artist" || item.type === "user";

  return (
    <Link href={item.href} onClick={onSelect} className="group block">
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-colors">
        <img
          src={item.image}
          alt={item.title}
          className={`h-12 w-12 object-cover ${
            isPerson ? "rounded-full" : "rounded-md"
          }`}
        />

        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-white group-hover:text-violet-400 transition-colors">
            {item.title}
          </p>

          <p className="truncate text-xs text-zinc-400">
            {typeConfig.label} {item.subtitle && `• ${item.subtitle}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <TypeIcon className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
          <span className="hidden sm:inline text-[10px] uppercase tracking-wide text-zinc-500">
            {typeConfig.label}
          </span>
        </div>
      </div>
    </Link>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <p className="px-3 mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
        {title}
      </p>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SearchPanel({ query, results, onSelect }) {
  const hasQuery = query.trim().length > 0;

  return (
    <div className="rounded-xl p-4 bg-[#121212] shadow-2xl border border-white/5 overflow-hidden">
      <div className="max-h-[420px] overflow-y-auto pt-3">
        {hasQuery ? (
          results.length ? (
            <Section title="Resultados">
              {results.map((item) => (
                <SearchResultItem key={item.id} item={item} onSelect={onSelect} />
              ))}
            </Section>
          ) : (
            <div className="px-4 py-10 text-center">
              <p className="text-sm font-semibold text-white">
                No encontramos resultados
              </p>
              <p className="text-xs text-zinc-500 mt-2">
                Intenta con otro término
              </p>
            </div>
          )
        ) : (
          <Section title="Recientes">
            {recentSearches.map((item) => (
              <SearchResultItem key={item.id} item={item} onSelect={onSelect} />
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const desktopSearchRef = useRef(null);

  const rankedResults = searchMockData
    .map((item) => ({
      ...item,
      score: getSearchScore(item, query),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  useEffect(() => {
    function handleClick(e) {
      if (!desktopSearchRef.current?.contains(e.target)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const clearSearch = () => {
    setQuery("");
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
  };

  return (
    <>
      <nav className="fixed op-0 z-50 w-full bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">

          <Link href="/" className="text-2xl font-black text-white">
            <span className="text-violet-500">L</span>ynz
          </Link>

          
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400 h-12">
            <Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link>
            <Link href="/genres" className="hover:text-white transition-colors">Rankings</Link>
            <div className="w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent mx-4" />
            <Link href="/reviews" className="hover:text-white transition-colors">Canciones</Link>
            <Link href="/genres" className="hover:text-white transition-colors">Albumes</Link>
            <Link href="/rankings" className="hover:text-white transition-colors">Artistas</Link>
          </div>

          <div className="flex items-center gap-4">

            <div ref={desktopSearchRef} className="relative hidden sm:block">
              
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="¿Qué quieres escuchar?"
                  className="w-64 rounded-full bg-[#1e1e1e] px-4 py-2 pr-10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />

                {/* BOTÓN X */}
                {query && (
                  <button
                    onClick={clearSearch}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isSearchOpen && (
                <div className="absolute left-1/2 top-full mt-3 w-[min(420px,calc(100vw-2rem))] -translate-x-1/2">
                  <SearchPanel
                    query={query}
                    results={rankedResults}
                    onSelect={closeSearch}
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="sm:hidden"
            >
              <Search className="w-5 h-5 text-zinc-400" />
            </button>

            <Link href="/profile">
              <User className="w-7 h-7 text-zinc-400 hover:text-white border border-zinc-400 hover:border-white rounded-full p-1 transition-all" />
            </Link>

            <Menu className="w-6 h-6 text-zinc-400 md:hidden" />
          </div>
        </div>
      </nav>

      {/* MOBILE */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md sm:hidden">
          <div className="p-4 pt-24">

            <div className="relative mb-4">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full rounded-full bg-[#1e1e1e] px-4 py-3 pr-10 text-white"
              />

              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <SearchPanel
              query={query}
              results={rankedResults}
              onSelect={closeSearch}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;