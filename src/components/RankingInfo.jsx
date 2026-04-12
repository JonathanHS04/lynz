import React from 'react'
import Link from 'next/link';

const RankingCard = ({ title, rank}) => {
    return (
        <Link href="/Rankings">
        <div className="bg-zinc-900/50 p-5 rounded-3xl border border-white/5 group hover:border-violet-500/30 cursor-pointer transition-all">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{title}</p>
            <p className="text-3xl font-black text-white mt-1 group-hover:text-violet-400 transition-colors">{rank}</p>
        </div>
        </Link>

    );
};

const RankingInfo = ({ rankings }) => {
    return (
        <section className="grid grid-cols-2 gap-4">
            {rankings.map((ranking) => (
                <RankingCard key={ranking.id} title={ranking.title} rank={ranking.rank} />
            ))}
        </section>
    );
};

export default RankingInfo;