"use client";

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getRatingBorder, getRatingFont } from '@/utils/getRatingStyle';

const MiniSonicProfile = ({ metrics = [] }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!metrics.length) return null;

    return (
        <div className="mt-4 rounded-2xl bg-black/25 py-3 max-w-2/3">
                <div className="grid grid-cols-6 gap-2">
                    {metrics.map((stat) => (
                        <div
                            key={stat.label}
                            className={`flex flex-col items-center justify-center rounded-xl bg-white/[0.02] p-2.5 text-center `}
                        >
                            <span className={`text-[9px] font-black uppercase tracking-[0.16em] ${getRatingFont(stat.value)}`}>
                                {stat.label}
                            </span>
                            <span className={`mt-1 block text-g font-black ${getRatingFont(stat.value)}`}>
                                {stat.value.toFixed(1)}
                            </span>
                        </div>
                    ))}
                </div>
        </div>
    )
}

export default MiniSonicProfile;