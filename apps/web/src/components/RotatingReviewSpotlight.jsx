"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageSquareMore, Star } from 'lucide-react';
import { getRatingBorder, getRatingFont } from '@/utils/getRatingStyle';
import ReviewCard from './ReviewCard';

const reviewCopy = [
    'Una reseña que pone en contexto el release sin perder ritmo.',
    'Comentario rápido, claro y suficiente para entender por qué está dando de qué hablar.',
    'Una lectura breve para entrar al disco, la canción o el artista desde la comunidad.',
    'La clase de reseña que te ayuda a decidir qué explorar después.',
];

const RotatingReviewSpotlight = ({ reviews = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (reviews.length <= 1) return undefined;

        const intervalId = window.setInterval(() => {
            setActiveIndex((currentIndex) => (currentIndex + 1) % reviews.length);
        }, 5000);

        return () => window.clearInterval(intervalId);
    }, [reviews.length]);

    if (!reviews.length) return null;

    const review = reviews[activeIndex];
    const reviewHref = `/Reviews/Album/${review.id}/${review.id}`;

    return (
        <section className="rounded-[1.75rem] bg-white/[0.02]">
            <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                    <h2 className="mt-2 text-2xl font-black uppercase tracking-tighter text-white">Reseñas</h2>
                </div>

                <div className="flex gap-1.5">
                    {reviews.map((item, index) => (
                        <span
                            key={item.id}
                            className={`h-1.5 rounded-full transition-all ${
                                index === activeIndex ? 'w-6 bg-violet-500' : 'w-2 bg-white/15'
                            }`}
                        />
                    ))}
                </div>
            </div>

            <Link href={reviewHref} className="flex flex-col-2 gap-4 group mt-5 block">
                <ReviewCard review={review} />
                <p>{reviewCopy[activeIndex]}</p>
            </Link>
        </section>
    );
};

export default RotatingReviewSpotlight;