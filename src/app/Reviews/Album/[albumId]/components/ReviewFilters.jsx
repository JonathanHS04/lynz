import React from 'react'
import { ArrowDownWideNarrow, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

const ReviewFilters = ({ sort, setSort, sortOrder, setSortOrder, showFilters, setShowFilters, filters, setFilters }) => {

    return (
        <>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-black uppercase tracking-tight">Reseñas</h2>

                <div className="flex items-center gap-2">
                    {/* SELECTOR DE ORDEN (PILLS) */}
                    <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
                        {[
                            { id: 'top', label: 'Top' },
                            { id: 'latest', label: 'Recientes' },
                            { id: 'rating', label: 'Rating' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setSort(opt.id)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${sort === opt.id
                                    ? "bg-white text-black shadow-lg"
                                    : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* BOTÓN DE DIRECCIÓN (ASC/DESC) - Ahora claro y funcional */}
                    <button
                        onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-95"
                    >
                        <ArrowDownWideNarrow
                            className={`w-4 h-4 transition-transform duration-300 ${sortOrder === "asc" ? "rotate-180 text-violet-400" : "text-zinc-400"
                                }`}
                        />
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 group-hover:text-zinc-300">
                            {sortOrder === "desc" ? "Desc" : "Asc"}
                        </span>
                    </button>

                    {/* BOTÓN FILTROS */}
                    <button
                        onClick={() => setShowFilters(prev => !prev)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase border transition-all ${showFilters
                            ? "bg-violet-500 border-violet-400 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                            : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                            }`}
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Filtros
                    </button>
                </div>
            </div>

            {/* PANEL DE FILTROS */}
            {showFilters && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl border border-white/10 bg-white/[0.02] animate-in fade-in slide-in-from-top-2">
                    {/* LIKES */}
                    <div className="space-y-3">
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Popularidad</p>
                        <div className="flex flex-wrap gap-2">
                            {[0, 10, 50, 100].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setFilters(f => ({ ...f, minLikes: val }))}
                                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${filters.minLikes === val ? "bg-white border-white text-black" : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/20"
                                        }`}
                                >
                                    {val === 0 ? "Todos" : `${val}+`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RATING */}
                    <div className="space-y-3">
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Rating Mínimo</p>
                        <div className="flex flex-wrap gap-2">
                            {[0, 7, 8, 9].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setFilters(f => ({ ...f, minRating: val }))}
                                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${filters.minRating === val ? "bg-white border-white text-black" : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/20"
                                        }`}
                                >
                                    {val === 0 ? "Cualquiera" : `${val}+ ★`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FECHA */}
                    <div className="space-y-3">
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Periodo</p>
                        <div className="flex flex-wrap gap-2">
                            {[{ k: "all", l: "Todo" }, { k: "week", l: "Semana" }, { k: "month", l: "Mes" }].map(d => (
                                <button
                                    key={d.k}
                                    onClick={() => setFilters(f => ({ ...f, date: d.k }))}
                                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${filters.date === d.k ? "bg-white border-white text-black" : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/20"
                                        }`}
                                >
                                    {d.l}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ReviewFilters