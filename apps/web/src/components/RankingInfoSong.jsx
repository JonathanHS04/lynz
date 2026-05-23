import Link from 'next/link';
import React from 'react'

const gridColsClass = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
};

const RankingCard = ({ title, rank, subtitle }) => {
    return (
        <Link href="/Rankings">
            {/* 1. min-h-[160px]: Asegura que todas midan lo mismo */}
            {/* 2. flex flex-col justify-between: Separa el titulo del ranking y el subtitulo */}
            <div className="bg-[#181818]/60 p-5 rounded-3xl border border-white/5 group hover:border-violet-500/30 cursor-pointer transition-all min-h-[160px] flex flex-col justify-between overflow-hidden">
                
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em] leading-tight">
                    {title}
                </p>
                
                <div className="flex flex-col flex-1 justify-center">
                    {/* text-4xl: Ajustado para que quepa bien en el aside de 2 columnas */}
                    <h3 className="text-4xl font-black text-white tracking-tighter group-hover:text-violet-400 transition-colors leading-none">
                        {rank}
                    </h3>
                </div>

                {/* line-clamp-2: Si el nombre del álbum o género es largo, no rompe la caja */}
                <p className="text-zinc-600 text-[10px] font-bold uppercase line-clamp-2 leading-tight">
                    {subtitle}
                </p>
            </div>
        </Link>
    );
};

const RankingInfoSong = ({ songData, cols = 4 }) => {
    const responsiveCols = gridColsClass[cols] ?? gridColsClass[4];

  return (
        <section className={`grid grid-cols-2 gap-3 ${responsiveCols}`}>
            <RankingCard title="Top Global" rank="#1203" subtitle="Del mundo" />
            <RankingCard title="Top del Género" rank="#304" subtitle={songData.genre} />
            <RankingCard title="Top del Artista" rank="#12" subtitle={songData.artist} />
            <RankingCard title="Top del Álbum" rank="#15/18" subtitle={songData.album} />
    </section>
  )
}

export default RankingInfoSong