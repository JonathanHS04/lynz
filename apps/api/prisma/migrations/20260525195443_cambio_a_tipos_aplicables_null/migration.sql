/*
  Warnings:

  - The `activeSince` column on the `artistInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `releaseDate` column on the `songInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "albumInfo" ALTER COLUMN "releaseDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "artistInfo" DROP COLUMN "activeSince",
ADD COLUMN     "activeSince" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "songInfo" DROP COLUMN "releaseDate",
ADD COLUMN     "releaseDate" TIMESTAMP(3);
