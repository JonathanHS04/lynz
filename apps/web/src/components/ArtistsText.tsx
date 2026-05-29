import React from "react";
import Link from "next/link";

// 1. Definimos la interfaz del Artista y de los Props
interface Artist {
  id: string;
  name: string;
  role: 'Main' | 'Feature';
}

interface ArtistsTextProps {
  artists: Artist[];
  mainClass?: string;
  featureClass?: string;
  links?: boolean;
  features?: boolean; // Si es false, ignoramos los features
}

const ArtistsText = ({
  artists,
  mainClass = "text-white hover:underline",
  featureClass = "text-zinc-400 hover:underline",
  links = true,
  features = true,
}) => {
  
  // Si no hay artistas, fallback rápido
  if (!artists || artists.length === 0) {
    return <span className="text-zinc-500">Desconocido</span>;
  }

  // Filtrar por roles
  // Cambia esto en tu componente:
const mainArtists = artists.filter((a) => !a.role || a.role === "Main");
const featureArtists = features ? artists.filter((a) => a.role === "Feature") : [];

  // Función interna para renderizar un artista (evita duplicar la lógica de <Link>)
  const renderArtistName = (artist: Artist, customClass: string) => {
    if (links) {
      return (
        <Link href={`/Artist/${artist.id}`} className={customClass}>
          {artist.name}
        </Link>
      );
    }
    return <span className={customClass}>{artist.name}</span>;
  };
  return (
    <div className="flex flex-wrap items-center">
      {/* 2. Renderizar Artistas Principales */}
      {mainArtists.map((artist, index) => (
        <React.Fragment key={artist.id}>
          {index > 0 && <span className="mr-1 text-zinc-500">,</span>}
          {renderArtistName(artist, mainClass)}
        </React.Fragment>
      ))}

      {/* 3. Renderizar Features (si existen) */}
      {featureArtists.length > 0 && (
        <>
          <span className="mx-1 text-zinc-500 lowercase font-medium">feat.</span>
          {featureArtists.map((artist, index) => (
            <React.Fragment key={artist.id}>
              {index > 0 && <span className="mr-1 text-zinc-500">,</span>}
              {renderArtistName(artist, featureClass)}
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  );
};

export default ArtistsText;