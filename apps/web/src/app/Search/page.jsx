import Link from "next/link";
import { Users, Disc3, Music2 } from "lucide-react";
import ReleaseCard from "@/components/ReleaseCard";
import Tracklist from "@/components/Tracklist/Tracklist";
import { searchAll } from "@/services/search";

function SearchSection({ title, subtitle, icon: Icon, items, emptyText, children }) {
    return (
        <section className="space-y-5">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.35em] text-zinc-500">
                        Search Results
                    </p>
                    <h2 className="mt-2 flex items-center gap-3 text-2xl font-black uppercase tracking-tight text-white">
                        <Icon className="h-6 w-6 text-violet-400" />
                        {title}
                    </h2>
                </div>
                <p className="text-xs text-zinc-500">{subtitle}</p>
            </div>

            {items.length ? (
                children
            ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-8 text-sm text-zinc-500">
                    {emptyText}
                </div>
            )}
        </section>
    );
}

// --- Artist Card ---
function ArtistCard({ artist }) {
    return (
        <Link
            href={artist.href}
            className="group flex flex-col items-center rounded-2xl p-4 text-center transition-all hover:bg-white/[0.04]"
        >
            <div className="relative aspect-square w-full overflow-hidden rounded-full border border-white/5 bg-zinc-900 transition group-hover:scale-105">
                <img
                    src={artist.image}
                    alt={artist.title}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="mt-4 w-full">
                <h3 className="truncate text-sm font-bold text-white group-hover:text-violet-300">
                    {artist.title}
                </h3>
            </div>
        </Link>
    );
}

// --- helpers ---
function extractIdFromHref(href) {
    return href.split("/").filter(Boolean).pop() ?? href;
}

function parseAlbumMeta(meta = "") {
    const [year = "2026", type = "Album"] = meta.split("•").map(v => v.trim());
    return { year, type };
}

function parseSongMeta(meta = "") {
    const [durationLabel] = meta.split("•").map(v => v.trim());
    const match = durationLabel?.match(/^(\d+):(\d{2})$/);

    if (!match) return 210000;

    return (Number(match[1]) * 60 + Number(match[2])) * 1000;
}

function splitArtists(subtitle = "") {
    const normalized = subtitle.replace(/\s+ft\.\s+/i, ",");
    const [artist, ...features] = normalized.split(",").map(v => v.trim()).filter(Boolean);

    return {
        artist: artist ?? "Artista desconocido",
        features,
    };
}

function getMockRating(item, type) {
    const source = `${type}:${item.id}`;
    let hash = 0;

    for (const char of source) hash += char.charCodeAt(0);

    return Number((7.8 + (hash % 22) / 10).toFixed(1));
}

function mapAlbumToRelease(album) {
    const { year, type } = parseAlbumMeta(album.meta);

    return {
        id: extractIdFromHref(album.href),
        title: album.title,
        artist: album.subtitle,
        image: album.image,
        year,
        type,
        rating: getMockRating(album, "album"),
    };
}

function mapSongToTrack(song) {
    const { artist, features } = splitArtists(song.subtitle);

    return {
        id: extractIdFromHref(song.href),
        title: song.title,
        artist,
        features,
        image: song.image,
        duration: parseSongMeta(song.meta),
        rating: getMockRating(song, "song"),
    };
}

export default async function SearchPage({ searchParams }) {
    const params = await searchParams;
    
    // 2. Extraemos el valor de 'q' (o el nombre que uses en tu input de búsqueda)
    // Usamos || "" para evitar errores si el usuario entra a /search sin parámetros
    const query = params.q || ""; 

    // 3. Llamamos a tu función de búsqueda con el query real
    const { artists, albums, songs, totalResults } = await searchAll(query);

    const releases = albums.map(mapAlbumToRelease);
    const tracks = songs.map(mapSongToTrack);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <main className="mx-auto max-w-7xl px-4 pt-28 pb-12 space-y-12">

                {/* EMPTY */}
                {query && totalResults === 0 && (
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center">
                        <p className="text-lg font-black uppercase tracking-widest">
                            Sin resultados
                        </p>
                        <p className="mt-2 text-sm text-zinc-500">
                            Intenta con otro término
                        </p>
                    </div>
                )}

                {/* 🔥 GRID PRINCIPAL */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">

                    {/* --- ARTISTAS --- */}
                    <div className="xl:col-span-2 gap-y-10 flex flex-col">
                        <SearchSection
                            title="Artistas"
                            subtitle="Top resultados"
                            icon={Users}
                            items={artists}
                            emptyText="No hay artistas."
                        >
                            <div className="grid grid-cols-2 gap-4">
                                {artists.map((artist) => (
                                    <ArtistCard key={artist.id} artist={artist} />
                                ))}
                            </div>
                        </SearchSection>
                        {/* ALBUMS */}
                        <SearchSection
                            title="Álbumes"
                            subtitle="Top resultados"
                            icon={Disc3}
                            items={albums}
                            emptyText="No hay álbumes."
                        >
                            <div className="grid grid-cols-2 gap-4">
                                {releases.map((release) => (
                                    <ReleaseCard
                                        key={release.id}
                                        release={release}
                                        author={true}
                                    />
                                ))}
                            </div>
                        </SearchSection>
                    </div>
                    

                    {/* --- DERECHA --- */}
                    <div className="xl:col-span-3 space-y-10">

                        {/* CANCIONES */}
                        <SearchSection
                            title="Canciones"
                            subtitle="Top 5 resultados"
                            icon={Music2}
                            items={songs}
                            emptyText="No hay canciones."
                        >
                            <div className="space-y-4">
                                <Tracklist
                                    tracks={tracks}
                                    images={true}
                                    numbers={false}
                                />
                            </div>
                        </SearchSection>

                        
                    </div>
                </div>
            </main>
        </div>
    );
}