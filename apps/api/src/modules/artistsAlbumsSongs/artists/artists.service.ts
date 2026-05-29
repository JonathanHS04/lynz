import { prisma } from "../../../config/prismaClient";
import { ApiError } from "../../../utils/ApiError";
import { sonicProfile, rating, artistRankings } from "../../../utils/mockData";
import { ArtistInfo, ArtistRatingData } from "@repo/types";
import { formatDbToArtistInfo, getArtistUpsert } from "./artists.utils";
import { createClient } from "@supabase/supabase-js";
import { Prisma } from "../../../generated/prisma";
import { syncAlbumReleaseAliases } from "../albums/albums.service";

const supabaseUrl: string | undefined = process.env.SUPABASE_URL;
const supabaseKey: string | undefined = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey)
  throw new ApiError("No se encontraron las variables de entorno de supabase");
const supabase = createClient(supabaseUrl, supabaseKey);

const AGENT = process.env.AGENT;
const TADB_API_KEY = process.env.THE_AUDIO_DB_API_KEY;
const MUSICBRAINZ_ARTIST_TIMEOUT_MS = 10000;
const MUSICBRAINZ_ARTIST_RETRIES = 2;
const artistWriteInflight = new Map<string, Promise<void>>();

  if (!AGENT || !TADB_API_KEY)
  throw new ApiError(
    "No se pudo acceder a las variables de entorno de agent y tadb",
  );

export const searchArtistInfoInDb = async (mbid: string) => {
  const artistDb = await prisma.artistInfo.findUnique({
    where: { id: mbid },
    include: {
      albums: {
        include: {
          album: {
            include: {
              requestedMbids: true,
            },
          },
        },
      },
    },
  });

  if (!artistDb || !artistDb.isComplete) return null;
  return formatDbToArtistInfo(artistDb);
};

const persistArtistInfoToDb = async (
  artistInfo: ArtistInfo,
) => {
  await prisma.$transaction(
    (tx) => tx.artistInfo.upsert(getArtistUpsert(artistInfo)),
    { timeout: 5000 },
  );

  await prisma.$transaction(
    (tx) => syncArtistAlbums(tx, artistInfo),
    { timeout: 15000 },
  );


    // 2. Sincronizar álbumes
};

export const addArtistInfoToDb = async (artistInfo: ArtistInfo) => {
  const existing = artistWriteInflight.get(artistInfo.id);
  if (existing) return existing;

  const promise = persistArtistInfoToDb(artistInfo).finally(() => {
    if (artistWriteInflight.get(artistInfo.id) === promise) {
      artistWriteInflight.delete(artistInfo.id);
    }
  });

  artistWriteInflight.set(artistInfo.id, promise);
  return promise;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchArtistData = async (mbid: string) => {
  const url = `https://musicbrainz.org/ws/2/artist/${mbid}?inc=release-groups+url-rels+genres&fmt=json`;
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= MUSICBRAINZ_ARTIST_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      MUSICBRAINZ_ARTIST_TIMEOUT_MS,
    );

    try {
      const res = await fetch(url, {
        headers: { "User-Agent": AGENT },
        signal: controller.signal,
      });

      if (res.status === 404) return null;

      if (!res.ok) {
        lastError = new Error(`MusicBrainz responded with ${res.status}`);
      } else {
        return await res.json();
      }
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }

    if (attempt < MUSICBRAINZ_ARTIST_RETRIES) {
      await wait(700 * (attempt + 1));
    }
  }

  console.error("MusicBrainz artist fetch failed after retries:", lastError);
  throw new ApiError("MusicBrainz no respondió correctamente", 503);
};

export const fecthArtistImage = async (mbid: string) => {
  let portraitImage = null;
  // Si no tienes API KEY en el .env, usamos la '2' por defecto para pruebas
  const key = TADB_API_KEY || "123";

  try {
    const tadbRes = await fetch(
      `https://www.theaudiodb.com/api/v1/json/${key}/artist-mb.php?i=${mbid}`,
    );

    // TheAudioDB a veces devuelve 200 OK con un body vacío si no encuentra nada
    const tadbData = await tadbRes.json();

    if (tadbData?.artists && tadbData.artists.length > 0) {
      const artistInfo = tadbData.artists[0];

      // Para un perfil tipo "Portrait", strArtistThumb es el estándar.
      // strArtistFanart es mejor para fondos de pantalla (Hero sections).
      portraitImage =
        artistInfo.strArtistThumb || artistInfo.strArtistFanart || null;

      // Si la imagen existe, forzamos HTTPS (a veces vienen como HTTP)
      if (portraitImage) {
        portraitImage = portraitImage.replace("http://", "https://");
      }
      console.log("Imagen encontrada en TheAudioDB:", portraitImage);
    }
  } catch (e) {
    console.error("Error fetching from TheAudioDB:", e);
  }
  return portraitImage;
};

export const getArtistRatingData = (mbid: string) => {
  const artistRatingData: ArtistRatingData = {
    sonicProfile,
    rating,
    rankings: artistRankings,
  };
  return artistRatingData;
};

export const uploadArtistImageFromTADB = async (imageUrl: string, mbid: string) => {
  try {
    // 1. Descargar la imagen
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Failed to download image");

    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // 2. Determinar la extensión
    const extension = imageUrl.split(".").pop()?.split(/\#|\?/)[0] || "jpg";
    const fileName = `${mbid}.${extension}`;

    // --- CAMBIO AQUÍ: Debe ser 'artistsImages' (con S) ---
    const bucketName = "artistsImages";

    // 3. Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, imageBuffer, {
        contentType: `image/${extension === "jpg" ? "jpeg" : extension}`,
        upsert: true,
      });

    if (error) {
      console.error("Error detallado de Supabase Storage:", error);
      throw error;
    }

    // 4. Obtener la URL pública (También con el nombre correcto)
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(fileName);

    return publicUrl;
  } catch (err) {
    console.error("Error en el proceso de subida:", err);
    return null;
  }
};


export const syncArtistAlbums = async (
  tx: Prisma.TransactionClient,
  artistInfo: ArtistInfo,
) => {
  const releasesByAlbumId = new Map<string, ArtistInfo["releases"][number]>();

  for (const album of artistInfo.releases) {
    if (album.id && !releasesByAlbumId.has(album.id)) {
      releasesByAlbumId.set(album.id, album);
    }
  }

  const artistOnAlbumRows: { artistId: string; albumId: string }[] = [];
  const rawAlbumIds = Array.from(releasesByAlbumId.keys());
  const existingAliases = await tx.albumRequestedMbid.findMany({
    where: { mbid: { in: rawAlbumIds } },
    select: { mbid: true, albumId: true },
  });
  const aliasMap = new Map(
    existingAliases.map((alias) => [alias.mbid, alias.albumId]),
  );

  for (const album of releasesByAlbumId.values()) {
    const albumId = aliasMap.get(album.id) ?? album.id;
    const knownReleaseMbids = [
      album.id,
      album.canonicalReleaseId,
      ...(album.requestedMbids ?? []),
    ].filter((mbid): mbid is string => Boolean(mbid));

    await syncArtistAlbumShell(tx, albumId, album);
    await syncAlbumReleaseAliases(tx, albumId, knownReleaseMbids);

    artistOnAlbumRows.push({
      artistId: artistInfo.id,
      albumId,
    });
  }

  if (artistOnAlbumRows.length > 0) {
    await tx.artistOnAlbum.createMany({
      data: artistOnAlbumRows,
      skipDuplicates: true,
    });
  }
};

const syncArtistAlbumShell = async (
  tx: Prisma.TransactionClient,
  albumId: string,
  album: ArtistInfo["releases"][number],
) => {
  await tx.$executeRaw`
    INSERT INTO "albumInfo" (
      id,
      name,
      image,
      type,
      "canonicalReleaseId",
      "releaseDate",
      "isComplete",
      "updatedAt"
    )
    VALUES (
      ${albumId},
      ${album.name},
      ${album.image ?? null},
      ${album.type ?? null},
      ${album.canonicalReleaseId ?? null},
      ${album.releaseDate ?? null},
      false,
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      "canonicalReleaseId" = COALESCE(
        "albumInfo"."canonicalReleaseId",
        EXCLUDED."canonicalReleaseId"
      ),
      image = CASE
        WHEN NOT "albumInfo"."isComplete"
        THEN COALESCE("albumInfo".image, EXCLUDED.image)
        ELSE "albumInfo".image
      END,
      type = CASE
        WHEN NOT "albumInfo"."isComplete"
        THEN COALESCE("albumInfo".type, EXCLUDED.type)
        ELSE "albumInfo".type
      END,
      "releaseDate" = CASE
        WHEN NOT "albumInfo"."isComplete"
        THEN COALESCE("albumInfo"."releaseDate", EXCLUDED."releaseDate")
        ELSE "albumInfo"."releaseDate"
      END,
      "updatedAt" = CASE
        WHEN NOT "albumInfo"."isComplete"
          OR "albumInfo"."canonicalReleaseId" IS NULL
        THEN now()
        ELSE "albumInfo"."updatedAt"
      END
  `;
};
