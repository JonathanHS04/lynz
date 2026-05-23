import { Router } from "express";

import { searchSongController, searchAlbumController, searchArtistController } from "../controllers/search.controllers.js";

const router = Router();

router.get("/albums", searchAlbumController);
router.get("/songs", searchSongController);
router.get("/artists", searchArtistController);

export default router;