import { searchSongs } from "@/services/search.js";
import SongCard from "@/components/SongCard";
import { SearchX, Music2 } from "lucide-react";

// --- helpers (mismos que ya usas) ---
function parseSongMeta(meta = "") {
    const [durationLabel] = meta.split("•").map(v => v.trim());
    const match = durationLabel?.match(/^(\d+):(\d{2})$/);

    if (!match) return 210000;

    return (Number(match[1]) * 60 + Number(match[2])) * 1000;
}


function mapSongToTrack(song) {
    return {
        id: song.id,
        title: song.title,
        artist: song.artist,
        features: song.features,
        image: song.image || "/placeholder-song.jpg",
        duration: parseSongMeta(song.meta || ""),
        rating: song.rating || 0,
    };
}

export default async function SearchSongsPage({ searchParams }) {
    const params = await searchParams;
    const query = params.q || "";

    let results = [];
    if (query) {
        results = await searchSongs(query);
    }

    const tracks = results.map(mapSongToTrack);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10">

                {/* 🔥 HEADER */}
                <header className="space-y-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.35em] text-zinc-500">
                        Search Results
                    </p>

                    <h1 className="flex items-center gap-3 text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
                        <Music2 className="w-8 h-8 text-violet-400" />
                        Canciones
                    </h1>

                    {query && (
                        <p className="text-xl text-violet-400 font-bold">
                            "{query}"
                        </p>
                    )}
                </header>

                {tracks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
                        {tracks.map((track) => (
                            <SongCard key={track.id} track={track} />
                        ))}
                    </div>
                ) : (
                    /* 🔥 EMPTY STATE (consistente con albums) */
                    <div className="flex flex-col items-center justify-center py-28 text-center">

                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-violet-500/20 blur-2xl opacity-40" />
                            <div className="relative rounded-full border border-white/10 bg-white/[0.03] p-6">
                                <SearchX className="w-10 h-10 text-zinc-500" />
                            </div>
                        </div>

                        <h3 className="text-lg font-black uppercase tracking-wider text-white">
                            Sin resultados
                        </h3>

                        <p className="mt-3 text-sm text-zinc-500 max-w-sm">
                            No encontramos canciones para{" "}
                            <span className="text-white">"{query}"</span>.
                            Intenta con otro término.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}