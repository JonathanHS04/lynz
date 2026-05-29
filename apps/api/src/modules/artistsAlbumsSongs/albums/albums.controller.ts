import { ApiError } from "../../../utils/ApiError.js";
import {
  Album,
  AlbumInfo,
  AlbumRatingData,
  AlbumBasicInfo,
  AlbumBasicRatingData,
  AlbumBasic,
} from "@repo/types";
import { Response, Request } from "express";
import {
  addAlbumInfoToDB,
  addKnownReleaseMbids,
  fetchAlbumData,
  getAlbumRatingData,
  searchAlbumInfoInDb,
} from "./albums.service.js";
import { formatAlbumInfo } from "./albums.utils.js";

const saveKnownReleaseAliasInBackground = (
  albumId: string,
  mbid: string,
  knownReleaseMbids: string[] | undefined,
) => {
  if (knownReleaseMbids?.includes(mbid)) return;

  addKnownReleaseMbids(albumId, [mbid]).catch((err) =>
    console.error("Error saving known release MBID in background", err),
  );
};

const handleControllerError = (
  res: Response,
  error: unknown,
  fallbackMessage: string,
) => {
  console.error(fallbackMessage, error);

  if (error instanceof ApiError) {
    return res.status(error.status).json({ error: error.message });
  }

  return res.status(500).json({ error: "Internal server error" });
};

export const getAlbumData = async (
  req: Request<{ mbid: string }>,
  res: Response,
) => {
  const { mbid } = req.params;

  if (!mbid) return res.status(400).json({ error: "MBID is required" });

  try {
    let albumInfo = (await searchAlbumInfoInDb(mbid)) as AlbumInfo | null;
    let addToDb = false;

    if (albumInfo) {
      saveKnownReleaseAliasInBackground(
        albumInfo.id,
        mbid,
        albumInfo.requestedMbids,
      );
    }

    if (!albumInfo) {
      addToDb = true;
      const albumFetchResult = await fetchAlbumData(mbid);

      if (!albumFetchResult) {
        return res.status(404).json({ error: "Album not found" });
      }

      albumInfo = formatAlbumInfo(
        albumFetchResult,
        "complete",
      ) as AlbumInfo;
    }

    const albumRatingData = getAlbumRatingData(
      albumInfo.id,
      "complete",
    ) as AlbumRatingData;

    const albumData: Album = {
      ...albumInfo,
      ...albumRatingData,
    };

    res.status(200).json(albumData);

    if (addToDb) {
      addAlbumInfoToDB(albumInfo).catch((err) => {
        console.error("Error saving Album to DB in background:", err);
      });
    }
  } catch (error) {
    return handleControllerError(res, error, "Error fetching Album data:");
  }
};

export async function getAlbumBasicInfo(
  req: Request<{ mbid: string }>,
  res: Response,
) {
  const { mbid } = req.params;

  if (!mbid) {
    return res.status(400).json({ error: "Album ID is required" });
  }

  try {
    let albumBasicInfo = (await searchAlbumInfoInDb(
      mbid,
      "basic",
    )) as AlbumBasicInfo | null;
    let addToDb = false;
    let albumFetchResult: Awaited<ReturnType<typeof fetchAlbumData>> = null;

    if (albumBasicInfo) {
      saveKnownReleaseAliasInBackground(
        albumBasicInfo.id,
        mbid,
        albumBasicInfo.requestedMbids,
      );
    }

    if (!albumBasicInfo) {
      addToDb = true;
      albumFetchResult = await fetchAlbumData(mbid);

      if (!albumFetchResult) {
        return res.status(404).json({ error: "Album not found" });
      }

      albumBasicInfo = formatAlbumInfo(
        albumFetchResult,
        "basic",
      ) as AlbumBasicInfo;
    }

    const albumBasicRatingData = getAlbumRatingData(
      albumBasicInfo.id,
      "basic",
    ) as AlbumBasicRatingData;

    const albumBasicData: AlbumBasic = {
      ...albumBasicInfo,
      ...albumBasicRatingData,
    };

    res.status(200).json(albumBasicData);

    if (addToDb && albumFetchResult) {
      const albumInfo = formatAlbumInfo(
        albumFetchResult,
        "complete",
      ) as AlbumInfo;

      addAlbumInfoToDB(albumInfo).catch((err) => {
        console.error("Error saving Album Basic Info to DB in background:", err);
      });
    }
  } catch (error) {
    return handleControllerError(res, error, "Error fetching album info:");
  }
}
