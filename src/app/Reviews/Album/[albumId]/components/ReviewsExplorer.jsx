import React from 'react'
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, ArrowDownWideNarrow, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Link from 'next/link';
import { albumData, userReviews } from '../mockData';
import RatingSquare from '@/components/RatingSquare';
import LikeAndComment from '@/components/LikeAndComment';
import { formatRelativeTime } from '@/utils/formatTime';
import ReviewCard from './ReviewCard';
import ReviewFilters from './ReviewFilters';

const ReviewsExplorer = ({ reviewsState, setReviewsState }) => {
    const router = useRouter();


    const [sort, setSort] = useState("top");

    const [sortOrder, setSortOrder] = useState("desc"); // asc | desc

    const [showFilters, setShowFilters] = useState(false);

    const [page, setPage] = useState(1);
    const REVIEWS_PER_PAGE = 6;

    const [filters, setFilters] = useState({
        minLikes: 0,
        minRating: 0,
        date: "all" // all | week | month
    });

    const processedReviews = useMemo(() => {
        let filtered = [...reviewsState];

        // --- FILTROS ---
        filtered = filtered.filter(r => {
            const passLikes = r.likes >= filters.minLikes;
            const passRating = r.rating >= filters.minRating;

            let passDate = true;
            if (filters.date !== "all") {
                const now = Date.now();
                const reviewDate = new Date(r.date);
                const diff = now - reviewDate.getTime();

                if (filters.date === "week") passDate = diff < 7 * 24 * 60 * 60 * 1000;
                if (filters.date === "month") passDate = diff < 30 * 24 * 60 * 60 * 1000;
            }
            return passLikes && passRating && passDate;
        });

        // --- SORT (CORREGIDO) ---
        filtered.sort((a, b) => {
            let comparison = 0;

            if (sort === "top") {
                comparison = a.likes - b.likes;
            } else if (sort === "latest") {
                comparison = new Date(a.date) - new Date(b.date);
            } else if (sort === "rating") {
                comparison = a.rating - b.rating;
            }

            // Si es "desc", invertimos la comparación (el mayor primero)
            return sortOrder === "desc" ? -comparison : comparison;
        });

        return filtered;
    }, [reviewsState, sort, sortOrder, filters]); // <-- IMPORTANTE: Añade sortOrder aquí

    const totalPages = Math.ceil(processedReviews.length / REVIEWS_PER_PAGE);

    const paginatedReviews = processedReviews.slice(
        (page - 1) * REVIEWS_PER_PAGE,
        page * REVIEWS_PER_PAGE
    );
    return (
        <>
            {/* TOP BAR - Reemplaza solo este div y el bloque de showFilters */}
            <ReviewFilters sort={sort} setSort={setSort} sortOrder={sortOrder}
                setSortOrder={setSortOrder} showFilters={showFilters}
                setShowFilters={setShowFilters} filters={filters} setFilters={setFilters} />

            {/* REVIEWS */}
            <div className="space-y-3">
                {paginatedReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} reviewsState={reviewsState} setReviewsState={setReviewsState} router={router} />
                ))}
            </div>

            {/* PAGINACIÓN */}
            <div className="flex justify-center gap-3 pt-6">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-3 rounded-full bg-white/5 border border-white/10 disabled:opacity-30"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-full ${page === i + 1
                            ? "bg-violet-500 text-white"
                            : "bg-white/5 text-zinc-400"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={page === totalPages}
                    className="p-3 rounded-full bg-white/5 border border-white/10 disabled:opacity-30"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </>
    )
}

export default ReviewsExplorer