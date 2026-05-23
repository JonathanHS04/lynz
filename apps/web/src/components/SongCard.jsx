import Link from "next/link";
import { getRatingFont } from "@/utils/getRatingStyle";
import RatingSquare from "@/components/Rating/RatingSquare";
import { Play } from "lucide-react";

export default function SongCard({ track }) {
    return (
        <Link href={`/Song/${track.id}`} className="h-full">
            <article className="group h-full flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all">

                {/* 🔥 IMAGE (PROTAGONISTA) */}
                <div className="relative aspect-square overflow-hidden border-b border-white/5">

                    <img
                        src={track.image}
                        alt={track.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* rating (igual que ReleaseCard) */}
                    <RatingSquare rating={track.rating} />
                </div>

                {/* 🔥 CONTENT */}
                <div className="p-5 flex-1 flex flex-col justify-between">

                    <div>
                        

                        {/* título */}
                        <h3 className={`text-lg font-black uppercase tracking-tight leading-tight transition-colors line-clamp-2 ${getRatingFont(track.rating)}`}>
                            {track.title}
                        </h3>

                        {/* artista */}
                        <p className="text-[10px] mt-2 font-black uppercase tracking-[0.3em] text-zinc-500">
                            {track.artist}
                        </p>

                        {/* features */}
                        {track.features?.length > 0 && (
                            <div className="flex flex-wrap gap-1 text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                                <span className="text-zinc-700 font-black">FT.</span>
                                {track.features.map((feat, i) => (
                                    <span key={i}>
                                        {feat}{i < track.features.length - 1 ? "," : ""}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

            </article>
        </Link>
    );
}