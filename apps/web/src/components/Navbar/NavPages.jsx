"use client";
import React from 'react'
import { usePathname } from "next/navigation";
import Link from "next/link";

const NavPages = () => {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400 h-12">
            <Link href="/reviews" className={`transition-colors hover:text-white ${pathname === '/reviews' ? 'text-white font-semibold border-b border-violet-500 pb-1' : ''}`}>Reviews</Link>
            <Link href="/Rankings" className={`transition-colors hover:text-white ${pathname === '/Rankings' ? 'text-white font-semibold border-b border-violet-500 pb-1' : ''}`}>Rankings</Link>
            <div className="w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent mx-4" />
            <Link href="/Canciones" className={`transition-colors hover:text-white ${pathname === '/Canciones' ? 'text-white font-semibold border-b border-violet-500 pb-1' : ''}`}>Canciones</Link>
            <Link href="/Albums" className={`transition-colors hover:text-white ${pathname === '/Albums' ? 'text-white font-semibold border-b border-violet-500 pb-1' : ''}`}>Albumes</Link>
            <Link href="/Artists" className={`transition-colors hover:text-white ${pathname === '/Artists' ? 'text-white font-semibold border-b border-violet-500 pb-1' : ''}`}>Artistas</Link>
        </div>
    )
}

export default NavPages