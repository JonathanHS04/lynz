import { searchAlbums } from "../services/search/searchAlbum.service.js";
import { searchSongs } from "../services/search/searchSong.service.js";
import { searchArtists } from "../services/search/searchArtist.service.js";
import { Request, Response } from "express";

export const searchAlbumController = async (req: Request, res: Response) => {
  const { q } = req.query;
  const results = await searchAlbums(q);

  res.json(results);
}

export const searchSongController = async (req: Request, res: Response) => {
  const { q } = req.query;
  const results = await searchSongs(q);
  res.json(results);
}

export const searchArtistController = async (req: Request, res: Response) => {
  const { q } = req.query;
  const results = await searchArtists(q);
  res.json(results);
}