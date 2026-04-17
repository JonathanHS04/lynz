export const featuredAlbum = {
  id: "22047c46-51da-4762-abd0-e31191e6610f",
  artist: "Omar Courtz",
  album: "POR SI MAÑANA NO ESTOY",
  score: 9.4,
  image: "https://i1.sndcdn.com/artworks-72d80e69-18fe-4175-b049-3393db902285-0-t500x500.jpg",
  genre: "Reguetón/Trap Latino",
};

export const featuredSong = {
  id: "cd132e69-1be3-4b78-a36c-f6042b3bde50",
  artist: "Tainy",
  title: "Monstruo",
  score: 9.6,
  image: "https://es.rollingstone.com/wp-content/uploads/2025/10/Tainy-comienza-un-nuevo-capitulo-junto-a-Feid-con-Monstruo-1.jpg",
  genre: "Reguetón/Trap Latino",
};

export const featuredArtist = {
  id: 1,
  name: "Omar Courtz",
  rating: 9.7,
  city: "Puerto Rico",
  genre: "Reggaetón / Trap Latino / Experimental",
  image: "https://is1-ssl.mzstatic.com/image/thumb/AMCArtistImages221/v4/f5/7c/21/f57c21d6-590a-b07e-1027-e92e6c62cfe6/ami-identity-cee5abcdd03c2870378144a376dce33d-2025-04-18T00-19-44.218Z_cropped.png/1280x720bb.png",
  summary: "Una de las figuras que mejor está conectando estética, hooks y conversación dentro de la escena urbana actual."
};

export const quickExplore = [
  {
    title: "Álbumes",
    description: "Nuevos lanzamientos, proyectos clave y puntuaciones destacadas.",
    href: "/Album/Explorer",
  },
  {
    title: "Canciones",
    description: "Tracks en tendencia, singles fuertes y picks rápidos.",
    href: "/Song/Explorer",
  },
  {
    title: "Artistas",
    description: "Perfiles, eras, colaboraciones y momentos clave.",
    href: "/Artist/Explorer",
  },
  {
    title: "Reseñas",
    description: "Lo que la comunidad está comentando ahora mismo.",
    href: "/Reviews/Explorer",
  },
];

export const weeklySpotlight = [
  {
    type: "Álbum",
    title: featuredAlbum.album,
    subtitle: featuredAlbum.artist,
    description: featuredAlbum.summary,
    image: featuredAlbum.image,
    href: `/Album/${featuredAlbum.id}`,
    score: featuredAlbum.score,
    meta: featuredAlbum.genre,
  },
  {
    type: "Canción",
    title: featuredSong.title,
    subtitle: featuredSong.artist,
    description: featuredSong.summary,
    image: featuredSong.image,
    href: `/Song/${featuredSong.id}`,
    score: featuredSong.score,
    meta: featuredSong.genre,
  },
  {
    type: "Artista",
    title: featuredArtist.name,
    subtitle: featuredArtist.city,
    description: featuredArtist.summary,
    image: featuredArtist.image,
    href: `/Artist/${featuredArtist.id}`,
    score: featuredArtist.rating,
    meta: `${featuredArtist.monthlyListeners} oyentes mensuales`,
  },
];

export const recentReviews = [
  { 
    id: 2, 
    username: "PepitoReviews", 
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", 
    artist: "The Smile", 
    album: "Wall of Eyes", 
    rating: 9.6, 
    genre: "Post-Punk", 
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop" 
  },
  { 
    id: 3, 
    username: "JazzLover", 
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka", 
    artist: "Kamasi Washington", 
    album: "Fearless Movement", 
    rating: 9.0, 
    genre: "Jazz", 
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2069&auto=format&fit=crop" 
  },
  { 
    id: 4, 
    username: "PostPunkFan", 
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dusty", 
    artist: "Fontaines D.C.", 
    album: "Romance", 
    rating: 8.9, 
    genre: "Post-Punk", 
    image: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=2079&auto=format&fit=crop" 
  },
  { 
    id: 5, 
    username: "IndieVibes", 
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver", 
    artist: "Vampire Weekend", 
    album: "Only God Was Above Us", 
    rating: 8.4, 
    genre: "Indie Pop", 
    // NUEVA URL: Imagen optimizada de Last.fm (mucho más estable)
    image: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=2079&auto=format&fit=crop" 
  },
  { 
    id: 6, 
    username: "ElectroQueen", 
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi", 
    artist: "Charli XCX", 
    album: "BRAT", 
    rating: 9.2, 
    genre: "Electropop", 
    image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop" 
  },
  { 
    id: 7, 
    username: "FolkFanatic", 
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nala", 
    artist: "Beth Gibbons", 
    album: "Lives Outgrown", 
    rating: 8.8, 
    genre: "Folk", 
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop" 
  }
];

export const trendingAlbums = [
  { id: 8, artist: "Dua Lipa", album: "Radical Optimism", comments: 342, rating: 9.6 },
  { id: 9, artist: "St. Vincent", album: "All Born Screaming", comments: 289, rating: 8.6 },
  { id: 10, artist: "Justice", album: "Hyperdrama", comments: 215, rating: 9.2 },
  { id: 11, artist: "Khruangbin", album: "A LA SALA", comments: 198, rating: 7.9 },
  { id: 12, artist: "Taylor Swift", album: "The Tortured Poets...", comments: 856, rating: 7.2 }
];