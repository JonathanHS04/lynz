"use client"
import React, { useState, useEffect } from 'react'
import ReleaseCard from '@/components/ReleaseCard';
import Link from 'next/link';
import { AlbumArtistRelease } from '@repo/types/src/artistsAlbumsSongs/album';

const Releases = ({ artistId, releases, sectionLabel, size="default" }:
    {
        artistId: string,
        releases: AlbumArtistRelease[],
        sectionLabel: string,
        size?: "default" | "large"
    }
) => {
    const [displayLimit, setDisplayLimit] = useState(size === "large" ? 999 : 3);

    const gridClass = size === "large" ? "grid-cols-3 xl:grid-cols-5 gap-6" : "grid-cols-2 xl:grid-cols-3 gap-6";

    const hasMoreReleases = releases.length > displayLimit;
    return (
        <section className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <p className={sectionLabel}>Discografía</p>
                    <h2 className="text-3xl font-black">Lanzamientos</h2>
                </div>

                {hasMoreReleases && (
                    <Link href={`/Artist/${artistId}/Albums#artist-releases`} className="text-[12px] font-bold uppercase tracking-widest text-violet-400 hover:text-white transition-colors cursor-pointer pb-1">
                        Ver todo
                    </Link>
                )}
            </div>

            <div className={`grid ${gridClass}`}>
                {releases.slice(0, displayLimit).map(r => (
                    <ReleaseCard key={r.id} release={r} />
                ))}
            </div>
        </section>
    )
}

export default Releases
