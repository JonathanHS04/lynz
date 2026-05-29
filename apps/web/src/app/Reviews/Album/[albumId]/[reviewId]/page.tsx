import React from 'react';
import { ArrowLeft, Play, Clock, Headphones, Disc3 } from 'lucide-react';
import CommentsSection from '@/components/CommentsSection';
import TracklistReview from '@/components/Tracklist/TracklistReview';
import { getRatingFont, getRatingBorder } from '@/utils/getRatingStyle';
import BackButton from '@/components/BackButton';
import SonicProfileDashboard from '@/components/SonicProfileDashboard';
import Link from 'next/link';
import { getAlbumData } from '@/services/album';
import { AlbumReview } from '@repo/types';

const reviewData: AlbumReview = {
  albumId: "1", //albumId
  artistId: "1",
  userId: "1",
  reviewId: "1",
  artist: "Radiohead",
  albumName: "In Rainbows (Remastered)",
  albumReleaseDate: "2007",
  genre: "Art Rock / Experimental",
  duration: 2559,
  rating: 9.8,
  userRating: 9.5,
  likes: 25,
  albumImage: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop",
  username: "Elena Silva",
  userImage: "https://randomuser.me/api/portraits/women/1.jpg",
  date: "12 Mayo, 2024",
  reviewText: `Pocos álbumes en la historia reciente han logrado alterar la trayectoria no solo de una banda, sino de la industria musical en su totalidad. Cuando Radiohead lanzó 'In Rainbows' mediante un modelo de 'paga lo que quieras', el impacto cultural casi eclipsa el triunfo sónico que contenía.
  \nHoy, con esta remasterización, nos vemos obligados a enfocarnos puramente en el sonido. Desde los primeros compases polirrítmicos de '15 Step', es evidente que la banda encontró un punto de ebullición perfecto entre la alienación electrónica de 'Kid A' y la calidez analógica de sus primeros trabajos. Las guitarras de Jonny Greenwood serpentean con una urgencia renovada, mientras que la sección rítmica de Colin Greenwood y Phil Selway nunca ha sonado tan elástica y viva. 
  \nConclusión: 'In Rainbows' no es solo un hito en la carrera de Radiohead; es un manual de cómo envejecer con gracia, innovación y una devoción absoluta al arte. Esta versión remasterizada simplemente limpia el polvo de un vitral que ya era perfecto.`,
  songsReviews: [
    {
      reviewId: "1",
      songName: "15 Step",
      songId: "1",
      date: "12 Mayo, 2024",
      likes: 34,
      duration: 237,
      userRating: 9.5,
      reviewText: "Un arranque explosivo que combina ritmos quebrados con melodías hipnóticas.",
      comments: [
        {
          id: "1",
          username: "Carlos Mtz",
          userImage: "https://randomuser.me/api/portraits/men/12.jpg",
          text: "Ese ritmo inicial es adictivo, siempre regreso a esta canción.",
          likes: 12,
          date: "2h"
        },
        {
          id: "2",
          username: "Ana López",
          userImage: "https://randomuser.me/api/portraits/women/22.jpg",
          text: "Siento que define todo el vibe del álbum.",
          likes: 8,
          date: "5h"
        }
      ]
    },

    {
      reviewId: "2",
      songName: "Bodysnatchers",
      songId: "2",
      duration: 242,
      userRating: 9.0,
      date: "12 Mayo, 2024",
      likes: 34,
      reviewText: "Una canción intensa con un ritmo imparable.",
      comments: [
        {
          id: "1",
          username: "Luis R",
          userImage: "https://randomuser.me/api/portraits/men/33.jpg",
          text: "Esta canción en vivo es otra cosa 🔥",
          likes: 6,
          date: "1d"
        }
      ]
    },

    {
      reviewId: "3",
      songName: "Nude",
      songId: "3",
      duration: 255,
      userRating: 8.6,
      date: "12 Mayo, 2024",
      likes: 34,
      reviewText: "Una canción melancólica y hermosa.",
      comments: [
        {
          id: "1",
          username: "Valeria",
          userImage: "https://randomuser.me/api/portraits/women/44.jpg",
          text: "La voz aquí es simplemente perfecta.",
          likes: 15,
          date: "3h"
        },
        {
          id: "2",
          username: "Diego",
          userImage: "https://randomuser.me/api/portraits/men/55.jpg",
          text: "Siempre me pone triste pero en el buen sentido.",
          likes: 9,
          date: "6h"
        }
      ]
    },

    {
      reviewId: "4",
      songName: "Weird Fishes/Arpeggi",
      songId: "4",
      duration: 318,
      userRating: 9.8,
      reviewText: "Definitivamente la mejor del album, una obra maestra.",
      date: "12 Mayo, 2024",
      likes: 34,
      comments: [
        {
          id: "1",
          username: "Sofía",
          userImage: "https://randomuser.me/api/portraits/women/66.jpg",
          text: "Top 3 canciones de Radiohead fácil.",
          likes: 25,
          date: "1h"
        },
        {
          id: "2",
          username: "Andrés",
          userImage: "https://randomuser.me/api/portraits/men/77.jpg",
          text: "La progresión es hipnótica, no hay otra palabra.",
          likes: 18,
          date: "4h"
        }
      ]
    },

    {
      reviewId: "5",
      songName: "All I Need",
      songId: "5",
      duration: 228,
      userRating: 9.2,
      date: "12 Mayo, 2024",
      likes: 34,
      reviewText: "Una balada oscura y apasionada.",
      comments: [
        {
          id: "1",
          username: "Mariana",
          userImage: "https://randomuser.me/api/portraits/women/88.jpg",
          text: "La producción aquí es brutal.",
          likes: 7,
          date: "8h"
        }
      ]
    },

    {
      reviewId: "6",
      songName: "Faust Arp",
      songId: "6",
      duration: 129,
      userRating: 8.0,
      reviewText: "Un pequeño oasis de belleza minimalista.",
      date: "12 Mayo, 2024",
      likes: 34,
      comments: [
        {
          id: "1",
          username: "Jorge",
          userImage: "https://randomuser.me/api/portraits/men/91.jpg",
          text: "Muy infravalorada.",
          likes: 4,
          date: "2d"
        }
      ]
    },

    {
      reviewId: "7",
      songName: "Reckoner",
      songId: "7",
      duration: 290,
      userRating: 9.7,
      reviewText: "Una de las líneas de guitarra más memorables.",
      date: "12 Mayo, 2024",
      likes: 34,
      comments: [
        {
          id: "1",
          username: "Fernanda",
          userImage: "https://randomuser.me/api/portraits/women/99.jpg",
          text: "Esta canción me cambia el mood completamente.",
          likes: 20,
          date: "3h"
        },
        {
          id: "2",
          username: "Ricardo",
          userImage: "https://randomuser.me/api/portraits/men/100.jpg",
          text: "El clímax final es increíble.",
          likes: 11,
          date: "7h"
        }
      ]
    }
  ],

  userSonicProfile: [
    { label: 'Ritmo', value: 9.5 },
    { label: 'Flow', value: 9.8 },
    { label: 'Letra', value: 9.0 },
    { label: 'Producción', value: 8.6 },
    { label: 'Impacto', value: 9.8 },
    { label: 'Innovación', value: 9.2 },
  ],

  comments: []
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
                src={reviewData.albumImage} 
                alt={reviewData.albumName} 
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
                {reviewData.albumName}
              </h1>
              <h2 className="text-xl font-black md:text-2xl font-light text-gray-400">
                <Link href={`/Artist/${reviewData.artistId}`} className="font-bold hover:text-violet-500">{reviewData.artist}</Link>
              </h2>
            </div>
            <SonicProfileDashboard sonicProfile={reviewData.userSonicProfile} image={false} header={false}/>
            

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
                  <Link href={`/User/${reviewData.userId}`}><img src={reviewData.userImage} alt={reviewData.username} className="w-10 h-10 rounded-full mr-4" /></Link>
                  <Link href={`/User/${reviewData.userId}`} className="text-white font-bold hover:underline">{reviewData.username}</Link>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {reviewData.date}
                </div>
              </div>
            </header>

            {/* Cuerpo de la Reseña */}
            <div className="prose prose-invert prose-lg max-w-none text-gray-300">
              {reviewData.reviewText.split('\n').map((paragraph, index) => (
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
            <TracklistReview albumReviewData={reviewData} />
          </article>
        </div>
        
        <CommentsSection />
      </main>
    </div>
  );
}