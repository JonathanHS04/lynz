import React from 'react';
import { ArrowLeft, Play, Clock, Headphones, Disc3 } from 'lucide-react';
import CommentsSection from '@/components/CommentsSection';
import TracklistReview from '@/components/TracklistReview';

// --- MOCK DATA ---
const reviewData = {
  id: 1,
  artist: "Radiohead",
  album: "In Rainbows (Remastered)",
  releaseYear: "2007",
  label: "XL Recordings",
  genre: "Art Rock / Experimental",
  duration: "42:39",
  score: 9.8,
  image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop",
  author: "Elena Silva",
  date: "12 Mayo, 2024",
  content: [
    "Pocos álbumes en la historia reciente han logrado alterar la trayectoria no solo de una banda, sino de la industria musical en su totalidad. Cuando Radiohead lanzó 'In Rainbows' mediante un modelo de 'paga lo que quieras', el impacto cultural casi eclipsa el triunfo sónico que contenía. Hoy, con esta remasterización, nos vemos obligados a enfocarnos puramente en el sonido.",
    "Desde los primeros compases polirrítmicos de '15 Step', es evidente que la banda encontró un punto de ebullición perfecto entre la alienación electrónica de 'Kid A' y la calidez analógica de sus primeros trabajos. Las guitarras de Jonny Greenwood serpentean con una urgencia renovada, mientras que la sección rítmica de Colin Greenwood y Phil Selway nunca ha sonado tan elástica y viva.",
    "Conclusión: 'In Rainbows' no es solo un hito en la carrera de Radiohead; es un manual de cómo envejecer con gracia, innovación y una devoción absoluta al arte. Esta versión remasterizada simplemente limpia el polvo de un vitral que ya era perfecto."
  ],
  tracklist: [
    { title: "15 Step", duration: "3:57", rating: 9.5, reviewText: "Un arranque explosivo que combina ritmos quebrados con melodías hipnóticas. La percusión es tan juguetona como inquietante, marcando el tono para el resto del álbum." },
    { title: "Bodysnatchers", duration: "4:02", rating: 9.0},
    { title: "Nude", duration: "4:15", rating: 8.6},
    { title: "Weird Fishes/Arpeggi", duration: "5:18", rating: 9.8, reviewText: "Definitivamente la mejor del album, una obra maestra de construcción atmosférica." },
    { title: "All I Need", duration: "3:48", rating: 9.2 },
    { title: "Faust Arp", duration: "2:09", rating: 8.0,  reviewText: "No puedo puntuarla mejor al ser un interludio, pero es un pequeño oasis de belleza minimalista en medio del caos." },
    { title: "Reckoner", duration: "4:50", rating: 9.7, reviewText: "Un cierre por todo lo alto, con una de las líneas de guitarra más memorables de Radiohead." },
  ]
};

export default function ReviewDetailPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-violet-500/30 selection:text-violet-200">

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-16 relative">
          
          {/* COLUMNA IZQUIERDA: Sticky Sidebar (Artwork & Score) */}
          <aside className="lg:w-1/3 lg:sticky lg:top-32 h-fit">
            {/* Contenedor de la Portada con Glassmorphism Score */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/10 group mb-8 border border-white/5">
              <img 
                src={reviewData.image} 
                alt={reviewData.album} 
                className="w-full aspect-square object-cover"
              />
              {/* Floating Score Badge */}
              <div className="absolute top-6 right-6 flex flex-col items-center justify-center w-24 h-24 rounded-full border border-white/20 bg-[#0a0a0a]/60 backdrop-blur-xl shadow-2xl">
                <span className="text-3xl font-black text-violet-400 leading-none">{reviewData.score}</span>
                <span className="text-[10px] text-gray-300 uppercase tracking-widest mt-1">Score</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-4">
              <button className="w-full flex items-center justify-center py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                <Play className="w-5 h-5 mr-2 fill-current" />
                Escuchar en Spotify
              </button>
              <button className="w-full flex items-center justify-center py-4 bg-[#111] border border-white/10 text-white font-bold rounded-xl hover:bg-[#1a1a1a] transition-colors">
                <Headphones className="w-5 h-5 mr-2" />
                Apple Music
              </button>
            </div>
          </aside>

          {/* COLUMNA DERECHA: Contenido Editorial */}
          <article className="lg:w-2/3 pb-24">
            
            {/* Header del Artículo */}
            <header className="mb-12 border-b border-white/10 pb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full text-xs font-bold uppercase tracking-widest">
                  {reviewData.genre}
                </span>
                <span className="text-gray-500 text-sm">{reviewData.releaseYear}</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-4">
                {reviewData.album}
              </h1>
              <h2 className="text-3xl md:text-4xl font-light text-gray-400 mb-8">
                {reviewData.artist}
              </h2>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-medium">
                <div className="flex items-center">
                  <span className="text-white mr-2">Por:</span> {reviewData.author}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {reviewData.date}
                </div>
              </div>
            </header>

            {/* Cuerpo de la Reseña */}
            <div className="prose prose-invert prose-lg max-w-none text-gray-300">
              {reviewData.content.map((paragraph, index) => (
                <p key={index} className="mb-6 leading-relaxed text-lg">
                  {/* Drop cap para el primer párrafo */}
                  {index === 0 ? (
                    <span className="float-left text-6xl font-black text-violet-500 mr-3 leading-none mt-1">
                      {paragraph.charAt(0)}
                    </span>
                  ) : null}
                  {index === 0 ? paragraph.slice(1) : paragraph}
                </p>
              ))}
            </div>

            {/* Tracklist Section */}
            <TracklistReview reviewData={reviewData} />
          </article>
        </div>
        <CommentsSection />
      </main>
    </div>
  );
}