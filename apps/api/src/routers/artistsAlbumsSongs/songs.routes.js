import { Router } from "express";
import { getSongData, getSongBasicInfo } from "../../controllers/artistsAlbumsSongs/songs.controller.js";

const router = Router();

router.get("/:mbid", getSongData);
router.get("/basic/:mbid", getSongBasicInfo);

export default router;