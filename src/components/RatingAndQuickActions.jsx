import React from 'react'
import RatingButton from '@/components/RatingButton';
import { Share2, MessageSquare } from 'lucide-react';

const RatingAndQuickActions = ({rating}) => {
    return (
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
            <RatingButton rating={rating} />
            <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
            <div className="flex gap-4">
                <button className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"><Share2 className="w-6 h-6" /></button>
                <button className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"><MessageSquare className="w-6 h-6" /></button>
            </div>
        </div>
    )
}

export default RatingAndQuickActions