import React from 'react'

const ReviewsHub = () => {
  return (
    <section className="relative w-full flex flex-col justify-center overflow-hidden rounded-[2rem] border border-white/10 p-6 bg-gradient-to-br from-white/[0.03] to-white/[0.01] min-h-[320px]">
      {/* BACKGROUND GLOW (más sutil) */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-violet-500/15 blur-2xl rounded-full" />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-sky-500/10 blur-2xl rounded-full" />

      {/* CONTENIDO */}
      <div className="relative z-10 space-y-4">

        {/* HEADER */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">
            Comunidad
          </p>

          <h3 className="mt-2 text-xl font-black uppercase text-white leading-tight">
            Explora reseñas
          </h3>
        </div>

        {/* DESCRIPCIÓN */}
        <p className="text-sm text-zinc-400 leading-relaxed">
          Descubre qué está opinando la comunidad sobre música, artistas y álbumes.
        </p>

        {/* MINI ACTIVIDAD */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={`https://avatar.vercel.sh/user${i}`}
                className="w-7 h-7 rounded-full border border-[#0a0a0a]"
              />
            ))}
          </div>

          <span className="text-[11px] text-zinc-500">
            +120 hoy
          </span>
        </div>

        {/* CTA */}
        <button className="w-full cursor-pointer mt-2 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:scale-102 transition-all text-xs font-black uppercase tracking-wide text-white transition-all">
          Ver reseñas
        </button>

      </div>

    </section>
  )
}

export default ReviewsHub