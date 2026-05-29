/*
  Warnings:

  - You are about to drop the column `artistId` on the `albumInfo` table. All the data in the column will be lost.
  - You are about to drop the column `artistName` on the `albumInfo` table. All the data in the column will be lost.
  - You are about to drop the column `resolvedMbid` on the `albumInfo` table. All the data in the column will be lost.
  - You are about to drop the column `tracks` on the `albumInfo` table. All the data in the column will be lost.
  - You are about to drop the column `albumId` on the `songInfo` table. All the data in the column will be lost.
  - You are about to drop the column `albumImage` on the `songInfo` table. All the data in the column will be lost.
  - You are about to drop the column `albumName` on the `songInfo` table. All the data in the column will be lost.
  - You are about to drop the column `albumType` on the `songInfo` table. All the data in the column will be lost.
  - You are about to drop the column `artistId` on the `songInfo` table. All the data in the column will be lost.
  - You are about to drop the column `artistName` on the `songInfo` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `songInfo` table. All the data in the column will be lost.
  - You are about to drop the column `producers` on the `songInfo` table. All the data in the column will be lost.
  - The `releaseDate` column on the `songInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `albumInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `albumRatingInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `artistInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `artistRatingInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `songInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `songRatingInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ArtistRole" AS ENUM ('Main', 'Feature', 'Producer', 'Writer');

-- DropForeignKey
ALTER TABLE "albumInfo" DROP CONSTRAINT "albumInfo_artistId_fkey";

-- DropForeignKey
ALTER TABLE "songInfo" DROP CONSTRAINT "songInfo_artistId_fkey";

-- AlterTable
ALTER TABLE "albumInfo" DROP COLUMN "artistId",
DROP COLUMN "artistName",
DROP COLUMN "resolvedMbid",
DROP COLUMN "tracks",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requestedMbids" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "externalLinks" DROP NOT NULL,
ALTER COLUMN "duration" DROP NOT NULL;

-- AlterTable
ALTER TABLE "albumRatingInfo" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "artistInfo" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "externalLinks" DROP NOT NULL;

-- AlterTable
ALTER TABLE "artistRatingInfo" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "songInfo" DROP COLUMN "albumId",
DROP COLUMN "albumImage",
DROP COLUMN "albumName",
DROP COLUMN "albumType",
DROP COLUMN "artistId",
DROP COLUMN "artistName",
DROP COLUMN "features",
DROP COLUMN "producers",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "externalLinks" DROP NOT NULL,
ALTER COLUMN "duration" DROP NOT NULL,
DROP COLUMN "releaseDate",
ADD COLUMN     "releaseDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "songRatingInfo" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "ArtistOnAlbum" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtistOnAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistOnSong" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "role" "ArtistRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArtistOnSong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "position" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArtistOnAlbum_artistId_albumId_key" ON "ArtistOnAlbum"("artistId", "albumId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistOnSong_artistId_songId_role_key" ON "ArtistOnSong"("artistId", "songId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Track_albumId_songId_key" ON "Track"("albumId", "songId");

-- AddForeignKey
ALTER TABLE "ArtistOnAlbum" ADD CONSTRAINT "ArtistOnAlbum_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artistInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistOnAlbum" ADD CONSTRAINT "ArtistOnAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albumInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistOnSong" ADD CONSTRAINT "ArtistOnSong_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artistInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistOnSong" ADD CONSTRAINT "ArtistOnSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albumInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
