import Link from "next/link";
import { User, Music, Disc } from "lucide-react";

const options = [
    {
        title: "Artistas",
        description: "Explora perfiles, rankings y evolución",
        icon: User,
        href: "/explore/artists",
        color: "violet"
    },
    {
        title: "Canciones",
        description: "Descubre los tracks mejor valorados",
        icon: Music,
        href: "/explore/songs",
        color: "blue"
    },
    {
        title: "Álbumes",
        description: "Sumérgete en proyectos completos",
        icon: Disc,
        href: "/explore/albums",
        color: "pink"
    }
];

const colorStyles = {
    violet: {
        border: "border-violet-500/30",
        glow: "shadow-[0_0_30px_rgba(139,92,246,0.15)]",
        icon: "text-violet-400",
        hover: "hover:border-violet-400 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]"
    },
    blue: {
        border: "border-sky-500/30",
        glow: "shadow-[0_0_30px_rgba(14,165,233,0.15)]",
        icon: "text-sky-400",
        hover: "hover:border-sky-400 hover:shadow-[0_0_40px_rgba(14,165,233,0.3)]"
    },
    pink: {
        border: "border-pink-500/30",
        glow: "shadow-[0_0_30px_rgba(236,72,153,0.15)]",
        icon: "text-pink-400",
        hover: "hover:border-pink-400 hover:shadow-[0_0_40px_rgba(236,72,153,0.3)]"
    }
};

export default function ExploreHub() {
    return (
        <section>

            {/* HEADER */}
            <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">
                    Explorar
                </p>
                <h2 className="mt-2 text-2xl md:text-3xl font-black uppercase tracking-tighter">
                    Descubre música
                </h2>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                {options.map((item) => {
                    const style = colorStyles[item.color];
                    const Icon = item.icon;

                    return (
                        <Link key={item.title} href={item.href}>

                            <div
                                className={`
                                    group relative overflow-hidden rounded-[1.75rem]
                                    border bg-white/[0.02] p-6
                                    transition-all duration-300 cursor-pointer
                                    ${style.border} ${style.glow} ${style.hover}
                                    hover:scale-[1.03]
                                `}
                            >

                                {/* glow background */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                                </div>

                                {/* CONTENT */}
                                <div className="relative z-10 flex flex-col gap-4">

                                    {/* ICON */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-black/40 border border-white/10 ${style.icon}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    {/* TEXT */}
                                    <div>
                                        <h3 className="text-xl font-black tracking-tight">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-zinc-400 mt-1 leading-snug">
                                            {item.description}
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </Link>
                    );
                })}

            </div>
        </section>
    );
}