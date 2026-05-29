import { Router } from "express";
import { getSongData, getSongBasicInfo } from "../../modules/artistsAlbumsSongs/songs/songs.controller";

const router = Router();

router.get("/:mbid", getSongData);
router.get("/basic/:mbid", getSongBasicInfo);

export default router;