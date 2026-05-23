import { searchAlbums } from "../services/search/searchAlbum.service";
import { searchSongs } from "../services/search/searchSong.service";
import { searchArtists } from "../services/search/searchArtist.service";

export const searchAlbumController = async (req, res) => {
  const { q } = req.query;
  const results = await searchAlbums(q);

  res.json(results);
}

export const searchSongController = async (req, res) => {
  const { q } = req.query;
  const results = await searchSongs(q);
  res.json(results);
}

export const searchArtistController = async (req, res) => {
  const { q } = req.query;
  const results = await searchArtists(q);
  res.json(results);
}