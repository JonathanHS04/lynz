/*
  Warnings:

  - You are about to drop the column `releases` on the `artistInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "artistInfo" DROP COLUMN "releases";

-- AlterTable
ALTER TABLE "songInfo" ALTER COLUMN "releaseDate" SET DATA TYPE TEXT;
