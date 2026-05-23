"use client";
import React from 'react'
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';


const BackButton = ({type="default"}) => {
    const router = useRouter();

    const posittionClass = type === "relative" ? "relative z-20 top-4 left-[-6]" : "";
    return (
        <button
            onClick={() => router.back()}
            className={`group mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 transition-all cursor-pointer active:scale-95 hover:bg-white/10 ${posittionClass}`}
        >
            <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-white" />
            <span className="text-sm font-bold text-zinc-400 group-hover:text-white">
                Volver
            </span>
        </button>
    )
}

export default BackButton