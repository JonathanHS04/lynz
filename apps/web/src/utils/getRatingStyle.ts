const getRatingStyle = (rating: number) => {
  if (!rating) return 'bg-zinc-800 text-zinc-500 border border-zinc-700/50';

  if (rating >= 9.6) {
    return 'bg-violet-600/90 text-violet-100 border border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.15)] font-black';
  }

  if (rating >= 9.0) {
    return 'bg-sky-500/90 text-white border border-sky-400/50 shadow-[0_0_15px_rgba(14,165,233,0.15)]';
  }

  if (rating >= 8.6) {
    return 'bg-green-800 text-white border border-green-800 font-bold'; // 🔥 mejor verde
  }

  if (rating >= 8.0) {
    return 'bg-green-500 text-zinc-900 border border-green-500/60'; // claro
  }

  if (rating >= 7.0) {
    return 'bg-yellow-400 text-zinc-900 border border-yellow-300/60 font-bold';
  }

  if (rating >= 6.0) {
    return 'bg-orange-400 text-zinc-900 border border-orange-300/60 font-semibold';
  }

  if (rating >= 5.0) {
    return 'bg-red-500 text-white border border-red-400/50';
  }

  return 'bg-zinc-800 text-zinc-500 border border-zinc-700/50';
};

export const getRatingFont = (rating: number, groupHover=false) => {
  if (!rating) return 'text-zinc-600';

  // [9.6 - 10.0] : VIOLETA (Nivel Legendario)
  if (rating >= 9.6) {
    if (groupHover) return 'group-hover:text-violet-600 drop-shadow-[0_0_12px_rgba(139,92,246,0.5)] font-black';
    else return 'text-violet-600 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)] font-black';
  }

  // [9.0 - 9.5] : CIELO / CYAN (Obra Maestra)
  if (rating >= 9.0) {
    if (groupHover) return 'group-hover:text-sky-400 drop-shadow-[0_0_8px_rgba(14,165,233,0.4)] font-bold';
    else return 'text-sky-400 drop-shadow-[0_0_8px_rgba(14,165,233,0.4)] font-bold';
  }

  // [8.6 - 8.9] : VERDE ESMERALDA / OSCURO (Excelente)
  if (rating >= 8.6) {
    if (groupHover) return 'group-hover:text-emerald-700 drop-shadow-[0_0_6px_rgba(22,163,74,0.4)] font-bold';
    else return 'text-emerald-700 font-bold';
  }

  // [8.0 - 8.5] : VERDE BRILLANTE (Muy Bueno)
  if (rating >= 8.0) {
    if (groupHover) return 'group-hover:text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.4)] font-bold';
    return 'text-green-400/90 font-bold';
  }

  // [7.0 - 7.9] : AMARILLO (Notable)
  if (rating >= 7.0) {
    if (groupHover) return 'group-hover:text-yellow-400 drop-shadow-[0_0_6px_rgba(255,204,0,0.4)] font-bold';
    return 'text-yellow-400 font-bold';
  }

  // [6.0 - 6.9] : NARANJA (Decente)
  if (rating >= 6.0) {
    if (groupHover) return 'group-hover:text-orange-400 drop-shadow-[0_0_6px_rgba(255,165,0,0.4)] font-semibold';
    return 'text-orange-400 font-semibold';
  }

  // [5.0 - 5.9] : ROJO (Mediocre)
  if (rating >= 5.0) {
    if (groupHover) return 'group-hover:text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.4)] font-medium';
    return 'text-red-500 font-medium';
  }

  // [< 5.0] : GRIS (Bajo)
  if (groupHover) return 'group-hover:text-red-800';
  return 'text-red-800';
};

export const getRatingBorder = (rating: number) => {
  if (!rating) return 'border-zinc-700/50 shadow-none';

  // [9.6 - 10.0] : VIOLETA (Nivel Legendario)
  if (rating >= 9.6) {
    return 'border-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.3)]';
  }

  // [9.0 - 9.5] : CIELO / CYAN (Obra Maestra)
  if (rating >= 9.0) {
    return 'border-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.3)]';
  }

  // [8.6 - 8.9] : VERDE ESMERALDA / OSCURO (Excelente)
  if (rating >= 8.6) {
    return 'border-emerald-700 shadow-none';
  }

  // [8.0 - 8.5] : VERDE BRILLANTE (Muy Bueno)
  if (rating >= 8.0) {
    return 'border-green-400/90 shadow-none';
  }

  // [7.0 - 7.9] : AMARILLO (Notable)
  if (rating >= 7.0) {
    return 'border-yellow-400 shadow-none';
  }

  // [6.0 - 6.9] : NARANJA (Decente)
  if (rating >= 6.0) {
    return 'border-orange-400 shadow-none';
  }

  // [5.0 - 5.9] : ROJO (Mediocre)
  if (rating >= 5.0) {
    return 'border-red-500 shadow-none';
  }

  // [< 5.0] : GRIS (Bajo)
  return 'border-zinc-700/50 shadow-none';
};

export const getStatBarStyle = (rating: number) => {
  if (!rating) return 'bg-zinc-700';

  if (rating >= 9.6) {
    return 'bg-violet-600 shadow-[0_0_12px_rgba(139,92,246,0.35)]';
  }

  if (rating >= 9.0) {
    return 'bg-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.3)]';
  }

  if (rating >= 8.6) {
    return 'bg-emerald-700';
  }

  if (rating >= 8.0) {
    return 'bg-green-400';
  }

  if (rating >= 7.0) {
    return 'bg-yellow-400';
  }

  if (rating >= 6.0) {
    return 'bg-orange-400';
  }

  if (rating >= 5.0) {
    return 'bg-red-500';
  }

  return 'bg-zinc-600';
};

export const getRatingHoverBorder = (rating: number) => {
  if (!rating) return 'hover:border-zinc-700/70';

  if (rating >= 9.6) {
    return 'hover:border-violet-600/50';
  }

  if (rating >= 9.0) {
    return 'hover:border-sky-400/50';
  }

  if (rating >= 8.6) {
    return 'hover:border-emerald-700/50';
  }

  if (rating >= 8.0) {
    return 'hover:border-green-400/50';
  }

  if (rating >= 7.0) {
    return 'hover:border-yellow-400/50';
  }

  if (rating >= 6.0) {
    return 'hover:border-orange-400/50';
  }

  if (rating >= 5.0) {
    return 'hover:border-red-500/50';
  }

  return 'hover:border-zinc-700/50';
};

export default getRatingStyle;