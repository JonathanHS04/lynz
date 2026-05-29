/*
  Warnings:

  - You are about to drop the column `requestedMbids` on the `albumInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "albumInfo" DROP COLUMN "requestedMbids";

-- CreateTable
CREATE TABLE "AlbumRequestedMbid" (
    "mbid" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlbumRequestedMbid_pkey" PRIMARY KEY ("mbid")
);

-- CreateIndex
CREATE INDEX "AlbumRequestedMbid_albumId_idx" ON "AlbumRequestedMbid"("albumId");

-- CreateIndex
CREATE INDEX "ArtistOnAlbum_albumId_idx" ON "ArtistOnAlbum"("albumId");

-- CreateIndex
CREATE INDEX "ArtistOnSong_songId_idx" ON "ArtistOnSong"("songId");

-- CreateIndex
CREATE INDEX "Track_songId_idx" ON "Track"("songId");

-- CreateIndex
CREATE INDEX "albumInfo_name_idx" ON "albumInfo"("name");

-- CreateIndex
CREATE INDEX "artistInfo_name_idx" ON "artistInfo"("name");

-- CreateIndex
CREATE INDEX "songInfo_name_idx" ON "songInfo"("name");

-- AddForeignKey
ALTER TABLE "AlbumRequestedMbid" ADD CONSTRAINT "AlbumRequestedMbid_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albumInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
