import { ApiError } from "../../../utils/ApiError";
import {
  Album,
  AlbumArtistRelease,
  Artist,
  ArtistInfo,
  ArtistRatingData,
  ExternalLinks,
} from "@repo/types";
import { Request, Response } from "express";
import {
  fetchArtistData,
  fecthArtistImage,
  searchArtistInfoInDb,
  addArtistInfoToDb,
} from "./artists.service";
import { formatArtistInfo } from "./artists.utils";
import {
  getArtistRatingData,
  uploadArtistImageFromTADB,
} from "./artists.service";

export const getArtistData = async (
  req: Request<{ mbid: string }>,
  res: Response,
) => {
  const { mbid } = req.params;
  if (!mbid) return res.status(400).json({ error: "Missing mbid parameter" });

  try {
    // Sistema de cache implementar luego
    //const cachedArtist = await searchArtistInCache(mbid);
    //if (cachedArtist) return res.status(200).json(cachedArtist);

    let artistInfo: ArtistInfo | null = (await searchArtistInfoInDb(
      mbid,
    )) as ArtistInfo;
    let addToDb: boolean = false;
    let image: string | null = null;

    if (!artistInfo) {
      addToDb = true;
      let mbData = await fetchArtistData(mbid);
      if (!mbData) return res.status(404).json({ error: "Artist not found" });

      image = await fecthArtistImage(mbid);
      artistInfo = formatArtistInfo(mbData, image);
    }

    const artistRatingData = getArtistRatingData(mbid);

    const artistData: Artist = {
      ...artistInfo,
      ...artistRatingData,
    };

    res.status(200).json(artistData);

    if (addToDb) {
      addArtistInfoToDb(artistInfo).catch((err) => {
        console.error("Error saving Artist to DB in background:", err);
      });
      if (image) {
        uploadArtistImageFromTADB(image, mbid).catch((err) => {
          console.error(
            "Error uploading Artist image to Supabase in background:",
            err,
          );
        });
      }
    }

    // Sistema de cache implementar luego
    //addArtistToCache(mbid, artistData, image); // Guardamos en caché para futuras consultas
  } catch (error) {
    console.error("Error fetching Artist data:", error);
    if (error instanceof ApiError) {
      return res.status(error.status).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};
