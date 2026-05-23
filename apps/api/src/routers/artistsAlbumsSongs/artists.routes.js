import { Router } from "express";
import { getArtistData } from "../../controllers/artistsAlbumsSongs/artists.controller.js";

const router = Router();

router.get("/:mbid", getArtistData);

export default router;

