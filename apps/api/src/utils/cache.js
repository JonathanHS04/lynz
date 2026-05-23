import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { PureComponent } from "react";

import {prisma} from "../config/prismaClient.js"

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const searchSongInCache = async (mbid) => {
  const cachedSong = await prisma.songCache.findUnique({
    where: { mbid },
  });
  return cachedSong?.jsonData || null;
}

export const addSongToCache = async (mbid, jsonData) => {
  const newSong = await prisma.songCache.create({
    data: {
      mbid,
      jsonData,
    },
  });
  return newSong;
}

export const searchAlbumInCache = async (mbid) => {
  const cachedAlbum = await prisma.albumCache.findUnique({
    where: { mbid },
  });
  return cachedAlbum?.jsonData || null;
}

export const addAlbumToCache = async (mbid, jsonData) => {
  const newAlbum = await prisma.albumCache.create({
    data: {
      mbid,
      jsonData,
    },
  });
  return newAlbum;
}

const uploadArtistImageFromTADB = async (imageUrl, mbid) => {
  try {
    // 1. Descargar la imagen
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Failed to download image");

    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer); 

    // 2. Determinar la extensión
    const extension = imageUrl.split('.').pop().split(/\#|\?/)[0] || 'jpg';
    const fileName = `${mbid}.${extension}`;

    // --- CAMBIO AQUÍ: Debe ser 'artistsImages' (con S) ---
    const bucketName = 'artistsImages'; 

    // 3. Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, imageBuffer, {
        contentType: `image/${extension === 'jpg' ? 'jpeg' : extension}`,
        upsert: true
      });

    if (error) {
      console.error("Error detallado de Supabase Storage:", error);
      throw error;
    }

    // 4. Obtener la URL pública (También con el nombre correcto)
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return publicUrl;

  } catch (err) {
    console.error("Error en el proceso de subida:", err);
    return null;
  }
};

export const searchArtistInCache = async (mbid) => {
  const cachedArtist = await prisma.artistCache.findUnique({
    where: { mbid },
  });
  return cachedArtist?.jsonData || null;
}

export const addArtistToCache = async (mbid, jsonData, imageUrl) => {

  let uploadedImageUrl = null;
  if (imageUrl){
    uploadedImageUrl = await uploadArtistImageFromTADB(imageUrl, mbid);
  }

  jsonData.portrait = uploadedImageUrl;
  
  const newArtist = await prisma.artistCache.create({
    data: {
      mbid,
      jsonData,
    },
  });
  return newArtist;
}