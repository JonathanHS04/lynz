import { Router } from "express";
import { getAlbumData, getAlbumBasicInfo } from "../../controllers/artistsAlbumsSongs/albums.controller.js";

const router = Router();

router.get("/:mbid", getAlbumData);
router.get("/basic/:mbid", getAlbumBasicInfo);

export default router;