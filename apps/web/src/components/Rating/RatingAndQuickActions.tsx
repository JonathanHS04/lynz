'use client'

import React, { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import RatingButton from '@/components/Rating/RatingButton';
import { Share2, Star } from 'lucide-react';
import { FaSpotify } from "react-icons/fa";
import { SiApplemusic } from "react-icons/si";
import AlbumRatingModal from '@/components/Rating/AlbumRatingModal';
import SongRatingModal from '@/components/Rating/SongRatingModal';
import { getRatingBorder, getRatingFont } from '@/utils/getRatingStyle';
import { Album, Song, Artist } from '@repo/types';

const RatingAndQuickActions = ({
  data,
  type = "song",
  initialModalOpen = false,
  isReview = false
}:{
  data: Album | Song | Artist;
  type: "song" | "album" | "artist";
  initialModalOpen?: boolean;
  isReview?: boolean;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(initialModalOpen)
  const [submittedRating, setSubmittedRating] = useState(null)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const ratingHref = 
    type === "artist" ? `/Reviews/Artist/${data.id}`
    : type === "album" ? `/Reviews/Album/${data.id}`
    : `/Reviews/Song/${data.id}`


  const handleOpenRating = () => {
    if (pathname === ratingHref) {
      setIsModalOpen(true)
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set('rate', '1')
    router.push(`${ratingHref}?${params.toString()}`)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)

    if (pathname !== ratingHref) return
    if (!searchParams.has('rate')) return

    const params = new URLSearchParams(searchParams.toString())
    params.delete('rate')
    const nextQuery = params.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
  }

  const handleSubmitRating = ({ overall }) => {
    setSubmittedRating(overall)
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">

        <RatingButton href={ratingHref} rating={data.rating} type={type} isReview={isReview} />

        {/* DIVIDER */}
        <div className="h-12 w-[1px] bg-white/10 hidden md:block" />

        {/* ACTIONS */}
        <div className="flex items-center gap-4">

          {type !== "artist" && (
            <button
              onClick={handleOpenRating}
              className={`group flex h-[58px] min-w-[148px] items-center justify-center rounded-full border bg-white/5 px-5 text-sm font-bold tracking-wide text-white transition-all active:scale-95 cursor-pointer hover:bg-white/10 ${submittedRating ? `${getRatingBorder(submittedRating)} ${getRatingFont(submittedRating)}` : 'border-white/20'}`}>
              {submittedRating ? (
                <span className="flex flex-col items-center justify-center leading-none text-center">
                  <span className={`uppercase text-[8px] tracking-[0.24em] transition-colors opacity-70 ${getRatingFont(submittedRating)}`}>
                    Tu rating
                  </span>
                  <span className="mt-1 flex items-center gap-2">
                    <Star className={`w-5 h-5 transition-colors ${getRatingFont(submittedRating)} fill-current opacity-100`} />
                    <span className={`text-[1.35rem] font-black tracking-[-0.06em] leading-none ${getRatingFont(submittedRating)}`}>
                      {submittedRating < 10 ? submittedRating.toFixed(1) : submittedRating.toFixed(0)}
                    </span>
                  </span>
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                  <span className="uppercase text-xs tracking-wider text-zinc-400 group-hover:text-white transition-colors">
                    Calificar
                  </span>
                </span>
              )}
            </button>
          )}

        {/* SPOTIFY */}
        {data.externalLinks?.spotify && (
          <a
            href={data.externalLinks.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-full border border-white/10 bg-white/5 p-4 transition-all active:scale-95 hover:shadow-[0_0_20px_rgba(29,185,84,0.35)]"
          >
            <FaSpotify className="w-5 h-5 text-[#1DB954] group-hover:scale-110 transition-transform" />
          </a>
        )}

        {/* APPLE MUSIC */}
        {data.externalLinks?.appleMusic && (
          <a
            href={data.externalLinks.appleMusic}
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

      

      {
      type === 'album' ? (
        <AlbumRatingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitRating}
          albumData={data as Album}
        />
      ) : (
        <SongRatingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitRating}
          songData={data as Song}
        />
      )}
    </>
  )
}

export default RatingAndQuickActions;