import { Router } from "express";
import { getArtistData } from "../../modules/artistsAlbumsSongs/artists/artists.controller";

const router = Router();

router.get("/:mbid", getArtistData);

export default router;

