// utils/formatTime.js
export const formatRelativeTime = (dateInput: string | number | Date) => {
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "hace unos segundos";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;

  // Si es más de una semana, mejor mostrar la fecha exacta
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDuration = (ms: number) => {
  if (!ms) return "0:00";
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, '0')}`;
}

// Función auxiliar para duraciones largas (Horas y Minutos)
export function formatTotalDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }
  return `${minutes} min`;
}

export function getReleaseYear(releaseDate: string) {
  if (!releaseDate) return null;
  const date = new Date(releaseDate);
  if (isNaN(date.getTime())) return null;
  return date.getFullYear();
}