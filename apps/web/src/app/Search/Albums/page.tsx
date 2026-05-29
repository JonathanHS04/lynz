import { searchAlbums } from "@/services/search.js";
import ReleaseCard from "@/components/ReleaseCard";
import { SearchX } from "lucide-react";
import {Album} from '@repo/types';

export default async function SearchPage({ searchParams }) {
    const params = await searchParams;
    const query = params.q || "";

    let results: Album[] = [];
    if (query) {
        results = await searchAlbums(query);
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10">

                {/* 🔥 HEADER */}
                <header className="space-y-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.35em] text-zinc-500">
                        Search Results
                    </p>

                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
                        Álbumes
                        {query && (
                            <span className="block text-violet-400 mt-2 text-2xl md:text-3xl">
                                "{query}"
                            </span>
                        )}
                    </h1>
                </header>

                {/* 🔥 RESULTADOS */}
                {results.length > 0 ? (
                    <div className="rounded-[32px]">

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {results.map((item) => (
                                <ReleaseCard
                                    key={item.id}
                                    release={item}
                                    author={true}
                                />
                            ))}
                        </div>

                    </div>
                ) : (
                    /* 🔥 EMPTY STATE MEJORADO */
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
                            No encontramos álbumes para <span className="text-white">"{query}"</span>.
                            Intenta con otro término o revisa la ortografía.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}