import { ApiError } from "../../../utils/ApiError";
import { Response, Request } from "express";
import {
  Song,
  SongBasic,
  SongBasicInfo,
  SongBasicRatingData,
  SongInfo,
  SongRatingData,
} from "@repo/types";

import { formatSongInfo } from "./songs.utils";
import { addSongInfoToDB, fetchSongData, getSongRatingData, searchSongInfoInDB } from "./songs.service"

const AGENT = process.env.AGENT;
const TADB_API_KEY = process.env.THE_AUDIO_DB_API_KEY;

if (!AGENT || !TADB_API_KEY){
  throw new ApiError(
    "No se pudo acceder a las variables de entorno de agent y tadb",
  );
}

export const getSongData = async (
  req: Request<{ mbid: string }>,
  res: Response,
) => {
  const { mbid } = req.params;
  if (!mbid) return res.status(400).json({ error: "MBID is required" });

  try {
    // Sistema de cache a implementar luego
    //const cachedSong = await searchSongInCache(mbid);
    //if (cachedSong) return res.status(200).json(cachedSong);

    // Añadimos url-rels para los links de plataformas

    let songInfo: SongInfo | null  = await searchSongInfoInDB(mbid) as SongInfo;
    let addToDB: boolean = false
    if (!songInfo) {
      addToDB = true
      const mbData = await fetchSongData(mbid);
      if (!mbData) return res.status(404).json({ error: "Song not found" });

      songInfo = formatSongInfo(mbData) as SongInfo;
    }

    const songRatingData: SongRatingData = getSongRatingData(mbid, songInfo.artists) as SongRatingData;

    const songData: Song = {
      ...songInfo,
      ...songRatingData,
    };

    res.status(200).json(songData);
    if (addToDB) {
      addSongInfoToDB(songInfo).catch(err => {
        console.error("Error saving Song to DB in background:", err);
      });
    }

    //Sistema de cache a implementar luego
    //addSongToCache(mbid, songData);
  } catch (error) {
    console.error("Error fetching MusicBrainz data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export async function getSongBasicInfo(
  req: Request<{ mbid: string }>,
  res: Response,
) {
  const { mbid } = req.params;
  if (!mbid) return res.status(400).json({ error: "Song ID is required" });

  try {

    let songBasicInfo: SongBasicInfo | null = await searchSongInfoInDB(mbid, "basic");
    let addToDB: boolean = false
    let data: any

    if(!songBasicInfo) {
      addToDB = true
      data = await fetchSongData(mbid, "basic")
      if (!data) return res.status(404).json({ error: "Song not found" });
      songBasicInfo = formatSongInfo(data, "basic");
    }
    
    const songBasicRatingData: SongBasicRatingData = getSongRatingData(mbid, songBasicInfo.artists, "basic")

    const songBasicData: SongBasic = {
      ...songBasicInfo,
      ...songBasicRatingData
    }

    res.status(200).json(songBasicData);

    if (addToDB) {
      let songInfo = formatSongInfo(data) as SongInfo
      addSongInfoToDB(songInfo).catch(err => {
        console.error("Error saving Song Basic Info to DB in background:", err);
      });
    }
  } catch (error) {
    console.error(`Error fetching song info:`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
