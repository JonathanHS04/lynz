import React from 'react';
import { ArrowLeft, Play, Clock, Headphones, Disc3 } from 'lucide-react';
import CommentsSection from '@/components/CommentsSection';
import TracklistReview from '@/components/TracklistReview';
import { getRatingFont, getRatingBorder } from '@/utils/getRatingStyle';
import BackButton from '@/components/BackButton';
import SonicProfile from '@/components/SonicProfile';
import Link from 'next/link';

// --- MOCK DATA ---
const reviewData = {
  id: 1,
  artist: "Radiohead",
  album: "In Rainbows (Remastered)",
  releaseYear: "2007",
  label: "XL Recordings",
  genre: "Art Rock / Experimental",
  duration: "42:39",
  rating: 9.8,
  image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop",
  author: "Elena Silva",
  authorImage: "https://randomuser.me/api/portraits/women/1.jpg",
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
  ],
  metrics: [
    { label: 'Ritmo', value: 9.5 },
    { label: 'Melodía', value: 9.8 },
    { label: 'Letra', value: 9.0 },
    { label: 'Producción', value: 8.6 },
    { label: 'Impacto', value: 9.8 },
    { label: 'Innovación', value: 9.2 },
  ]
};

export default function ReviewDetailPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-violet-500/30 selection:text-violet-200">

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-16 relative">
          
          {/* COLUMNA IZQUIERDA: Sticky Sidebar (Artwork & Score) */}
          <aside className="lg:w-1/4 lg:top-32 h-fit mt-20">
          {/* Acciones */}
            <div className="flex items-center gap-4 mb-4">
              <BackButton />
            </div>
            {/* Contenedor de la Portada con Glassmorphism Score */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/10 group mb-8 border border-white/5">
              <img 
                src={reviewData.image} 
                alt={reviewData.album} 
                className="w-full aspect-square object-cover"
              />
              {/* Floating Score Badge */}
              <div className={`absolute top-6 right-6 flex flex-col items-center justify-center w-24 h-24 rounded-full border-3 ${getRatingBorder(reviewData.rating)} bg-[#000000]/90 backdrop-blur-xl shadow-2xl`}>
                <span className={`text-3xl font-black ${getRatingFont(reviewData.rating)} leading-none`}>{reviewData.rating}</span>
                <span className="text-[10px] text-gray-300 uppercase tracking-widest mt-1">Score</span>
              </div>
            </div>
            <div className="justify-center text-left">
              <h1 className="text-5xl md:text-4xl font-black text-white leading-[1.1] tracking-tighter mb-4">
                {reviewData.album}
              </h1>
              <h2 className="text-xl font-black md:text-2xl font-light text-gray-400">
                <Link href={`/Artist/${reviewData.artistId}`} className="font-bold hover:text-violet-500">{reviewData.artist}</Link>
              </h2>
            </div>
            <SonicProfile data={reviewData} metrics={reviewData.metrics} image={false} header={false}/>
            

          </aside>

          {/* COLUMNA DERECHA: Contenido Editorial */}
          <article className="lg:w-3/4 pb-24 mt-30">
            
            {/* Header del Artículo */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-full text-xs font-bold uppercase tracking-widest">
                  Album Review
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-xl text-gray-500 font-medium">
                <div className="flex items-center">
                  <Link href={`/User/${reviewData.authorId}`}><img src={reviewData.authorImage} alt={reviewData.artist} className="w-10 h-10 rounded-full mr-4" /></Link>
                  <Link href={`/User/${reviewData.authorId}`} className="text-white font-bold hover:underline">{reviewData.author}</Link>
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
                <p key={index} className="mb-6 leading-relaxed text-g">
                  {/* Drop cap para el primer párrafo */}
                  {index === 0 ? (
                    <span className="float-left text-5xl font-black text-violet-500 mr-3 leading-none">
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