import React from 'react'
import RatingButton from '@/components/Rating/RatingButton';
import { Share2, Star } from 'lucide-react';
import { FaSpotify } from "react-icons/fa";
import { SiApplemusic } from "react-icons/si";

const RatingAndQuickActions = ({
  rating,
  ratingHref = '#',
  spotifyUrl = "#",
  appleUrl = "#",
  type = "default"
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">

      <RatingButton href={ratingHref} rating={rating} type={type} />

      {/* DIVIDER */}
      <div className="h-12 w-[1px] bg-white/10 hidden md:block" />

      {/* ACTIONS */}
      <div className="flex items-center gap-4">

        {/* RATE */}
        <button className="group flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-4 text-sm font-bold tracking-wide text-white transition-all active:scale-95 cursor-pointer hover:bg-white/10">
          <Star className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
          <span className="uppercase text-xs tracking-wider text-zinc-400 group-hover:text-white transition-colors">
            Calificar
          </span>
        </button>

        {/* SPOTIFY */}
        {spotifyUrl && (
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-full border border-white/10 bg-white/5 p-4 transition-all active:scale-95 hover:shadow-[0_0_20px_rgba(29,185,84,0.35)]"
          >
            <FaSpotify className="w-5 h-5 text-[#1DB954] group-hover:scale-110 transition-transform" />
          </a>
        )}

        {/* APPLE MUSIC */}
        {appleUrl && (
          <a
            href={appleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-full border border-white/10 bg-white/5 p-4 transition-all active:scale-95 hover:shadow-[0_0_20px_rgba(250,35,59,0.35)]"
          >
            <SiApplemusic className="w-5 h-5 text-[#FA233B] group-hover:scale-110 transition-transform" />
          </a>
        )}

        {/* SHARE */}
        <button className="group p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer active:scale-95">
          <Share2 className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
        </button>

      </div>
    </div>
  )
}

export default RatingAndQuickActions;