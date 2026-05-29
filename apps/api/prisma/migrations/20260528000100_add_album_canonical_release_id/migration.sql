-- Normalize albums around release-groups while keeping the selected MusicBrainz release.
ALTER TABLE "albumInfo"
ADD COLUMN IF NOT EXISTS "canonicalReleaseId" TEXT;

CREATE INDEX IF NOT EXISTS "albumInfo_canonicalReleaseId_idx"
ON "albumInfo"("canonicalReleaseId");
