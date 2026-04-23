import React from 'react'
import { Disc3, Mic2, Music2, Users } from "lucide-react";
import Link from "next/link";

const resultTypeStyles = {
  artist: { label: "Artista", icon: Users },
  album: { label: "Álbum", icon: Disc3 },
  song: { label: "Canción", icon: Music2 },
  user: { label: "Usuario", icon: Mic2 },
};

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
export default SearchResultItem;