import { Heart, MessageCircle } from "lucide-react";

export default function ReviewsAside({ reviews }) {
    return (
        <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">

            {/* HEADER */}
            <div className="mb-5">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-500">
                    Comunidad
                </p>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">
                    Reseñas recientes
                </h3>
            </div>

            {/* LISTA */}
            <div className="space-y-4">

                {reviews.slice(0, 2).map((review) => (
                    <div
                        key={review.id}
                        className="group rounded-xl border border-white/5 bg-black/30 p-4 transition-all hover:border-white/15 hover:bg-white/[0.03]"
                    >

                        {/* USER */}
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src={review.avatar}
                                className="w-9 h-9 rounded-full border border-white/10"
                            />

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">
                                    {review.username}
                                </p>
                                <p className="text-[10px] text-zinc-500">
                                    {review.timeAgo}
                                </p>
                            </div>

                            <span className="text-sm font-black text-violet-400">
                                {review.rating.toFixed(1)}
                            </span>
                        </div>

                        {/* TEXTO */}
                        <p className="text-sm text-zinc-300 leading-snug line-clamp-3">
                            {review.text}
                        </p>

                        {/* FOOTER */}
                        <div className="flex items-center gap-4 mt-3 text-zinc-500 text-xs">

                            <div className="flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5" />
                                {review.likes}
                            </div>

                            <div className="flex items-center gap-1">
                                <MessageCircle className="w-3.5 h-3.5" />
                                {review.comments}
                            </div>

                        </div>

                    </div>
                ))}

            </div>

            {/* CTA */}
            <button className="mt-5 w-full rounded-xl border border-white/10 bg-white/[0.03] py-2 text-xs font-black uppercase tracking-wider text-zinc-300 hover:border-violet-400 hover:text-violet-300 transition-colors">
                Ver todas las reseñas
            </button>

        </section>
    );
}