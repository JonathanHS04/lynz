-- CreateTable
CREATE TABLE "songCache" (
    "mbid" TEXT NOT NULL,
    "jsonData" JSONB NOT NULL,

    CONSTRAINT "songCache_pkey" PRIMARY KEY ("mbid")
);

-- CreateTable
CREATE TABLE "albumCache" (
    "mbid" TEXT NOT NULL,
    "jsonData" JSONB NOT NULL,

    CONSTRAINT "albumCache_pkey" PRIMARY KEY ("mbid")
);

-- CreateTable
CREATE TABLE "artistCache" (
    "mbid" TEXT NOT NULL,
    "jsonData" JSONB NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "artistCache_pkey" PRIMARY KEY ("mbid")
);
