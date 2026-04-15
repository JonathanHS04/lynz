import React from 'react'
import { Star } from 'lucide-react';
import { getRatingBorder, getRatingFont } from '@/utils/getRatingStyle';

const SonicProfile = ({ data, metrics, image=true, header=true, oneLine=false }) => {
    return (
        <article className="rounded-[2rem] bg-white/[0.02] p-6 md:p-8">

            {/* HEADER */}
            {header && (
                <div className="flex items-center justify-between mb-8">
                <div>
                    <p className='text-[10px] uppercase tracking-widest text-zinc-500 font-bold'>Basado en las reseñas</p>
                    <h2 className="text-2xl font-black uppercase tracking-tight">
                        Perfil musical
                    </h2>
                </div>
                <div className={`flex items-center px-3 py-2 rounded-xl border ${getRatingBorder(data.rating)}`}>
                    <Star className={`w-6 h-6 ${getRatingFont(data.rating)} mr-2 fill-current`} />
                    <span className={`text-xl font-black ${getRatingFont(data.rating)}`}>
                        {data.rating.toFixed(1)}
                    </span>
                </div>
            </div>
            )}

            {/* CONTENIDO: IMAGEN + GRID */}
            <div className={`grid grid-cols-1 gap-6 items-start ${image ? 'md:grid-cols-[220px_1fr]' : ''}`}>

                {/* IMAGEN INTEGRADA */}
                {image && (
                    <div className="relative group">
                        <img
                            src={data.image}
                            alt={data.title}
                            className="w-full h-52 object-cover rounded-[1.5rem] border border-white/10"
                        />
                    </div>
                )}

                {/* GRID DE MÉTRICAS */}
                <div className={`grid grid-cols-2 gap-4 ${!oneLine ? (image ? 'sm:grid-cols-3' : 'sm:grid-cols-2 xl:grid-cols-3') : 'grid-cols-6'}`}>
                    {metrics.map((stat) => (
                        <div
                            key={stat.label}
                            className={`rounded-[1.25rem] border justify-center items-center flex flex-col bg-black/30 p-4 transition-all ${getRatingBorder(stat.value)}`}
                        >
                            <span className="text-[10px] uppercase text-zinc-500">
                                {stat.label}
                            </span>
                            <span className={`block text-3xl font-black ${getRatingFont(stat.value)}`}>
                                {stat.value.toFixed(1)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </article>
    )
}

export default SonicProfile