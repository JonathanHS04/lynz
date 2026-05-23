"use client"
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InteractiveRating() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleClick = (value) => {
    setRating(value);
    setIsSubmitted(true);
    // Reset de la animación de "borde iluminado" después de 2 segundos
    setTimeout(() => setIsSubmitted(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2 mt-6">
      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] ml-1">
        {hover > 0 ? `Puntuar: ${hover}.0` : rating > 0 ? `Tu nota: ${rating}.0` : 'Deja tu review'}
      </p>
      
      <motion.div 
        animate={isSubmitted ? { borderColor: 'rgba(139, 92, 246, 0.5)', scale: 1.02 } : { borderColor: 'rgba(255,255,255,0.1)', scale: 1 }}
        className="flex items-center gap-1 bg-black/40 backdrop-blur-md p-2 px-4 rounded-2xl border-[1.5px] transition-colors duration-500"
      >
        {[...Array(10)].map((_, i) => {
          const starValue = i + 1;
          const isActive = starValue <= (hover || rating);
          const isSelected = starValue <= rating;

          return (
            <motion.button
              key={starValue}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
              className="relative p-1 focus:outline-none"
            >
              <Star
                size={40}
                strokeWidth={isActive ? 0 : 2}
                className={`transition-all duration-300 ${
                  isActive 
                    ? 'fill-violet-500 text-violet-500 drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]' 
                    : 'text-zinc-700'
                }`}
              />
              
              {/* Animación de partículas al hacer click (opcional pero top) */}
              <AnimatePresence>
                {isSubmitted && starValue === rating && (
                  <motion.span
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 4, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-violet-500 rounded-full z-[-1]"
                  />
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}