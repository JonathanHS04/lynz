import { Router } from "express";
import { getAlbumData, getAlbumBasicInfo } from "../../modules/artistsAlbumsSongs/albums/albums.controller"

const router = Router();

router.get("/:mbid", getAlbumData);
router.get("/basic/:mbid", getAlbumBasicInfo);

export default router;