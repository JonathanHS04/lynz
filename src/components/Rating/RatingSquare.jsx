import React from 'react'
import { Star } from 'lucide-react';
import { getRatingFont, getRatingBorder } from '@/utils/getRatingStyle';

const RatingSquare = ({ rating, variant = "default" }) => {
  const safeRating = typeof rating === "number" && Number.isFinite(rating) ? rating : null;

  const base = "inline-flex items-center";

  const variants = {
    default: `
      absolute top-4 right-4
      gap-1 px-2 py-2
      rounded-xl border bg-black/65 backdrop-blur-sm
      ${getRatingBorder(safeRating)}
    `,

    inline: `
      gap-1 px-2 py-2
      rounded-lg border bg-black/65 backdrop-blur-sm
      ${getRatingBorder(safeRating)}
    `,

    review: `
      shrink-0
      gap-1.5 px-2.5 py-1.5
      rounded-xl border border-white/10 bg-black/30
      text-xs font-black
    `,
  };

  return (
    <div className={`${base} ${variants[variant]} ${getRatingFont(safeRating)}`}>
      <Star
        className={`h-4 w-4 fill-current`}
        strokeWidth={2.2}
      />
      <span className={`${variant === "review" ? "" : "text-sm font-black"}`}>
        {safeRating === null ? "--" : safeRating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingSquare;