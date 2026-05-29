-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'moderator', 'admin');

-- CreateTable
CREATE TABLE "albumInfo" (
    "id" TEXT NOT NULL,
    "resolvedMbid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "externalLinks" JSONB NOT NULL,
    "duration" INTEGER NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "genre" TEXT NOT NULL,
    "tracks" JSONB NOT NULL,

    CONSTRAINT "albumInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "albumRatingInfo" (
    "id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "sonicProfile" JSONB NOT NULL,
    "userReviews" JSONB NOT NULL,
    "rankings" JSONB NOT NULL,

    CONSTRAINT "albumRatingInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "songInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "image" TEXT NOT NULL,
    "externalLinks" JSONB NOT NULL,
    "albumName" TEXT NOT NULL,
    "albumType" TEXT NOT NULL,
    "albumId" TEXT,
    "albumImage" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "producers" JSONB NOT NULL,

    CONSTRAINT "songInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "songRatingInfo" (
    "id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "sonicProfile" JSONB NOT NULL,
    "artistsPerformance" JSONB NOT NULL,
    "userReviews" JSONB NOT NULL,
    "rankings" JSONB NOT NULL,

    CONSTRAINT "songRatingInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artistInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "activeSince" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "genres" JSONB NOT NULL,
    "externalLinks" JSONB NOT NULL,
    "releases" JSONB NOT NULL,

    CONSTRAINT "artistInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artistRatingInfo" (
    "id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "sonicProfile" JSONB NOT NULL,
    "rankings" JSONB NOT NULL,

    CONSTRAINT "artistRatingInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "albumInfo" ADD CONSTRAINT "albumInfo_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artistInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albumRatingInfo" ADD CONSTRAINT "albumRatingInfo_id_fkey" FOREIGN KEY ("id") REFERENCES "albumInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "songInfo" ADD CONSTRAINT "songInfo_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artistInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "songRatingInfo" ADD CONSTRAINT "songRatingInfo_id_fkey" FOREIGN KEY ("id") REFERENCES "songInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artistRatingInfo" ADD CONSTRAINT "artistRatingInfo_id_fkey" FOREIGN KEY ("id") REFERENCES "artistInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
