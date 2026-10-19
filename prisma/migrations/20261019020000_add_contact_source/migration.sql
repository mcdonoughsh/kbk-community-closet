-- CreateEnum
CREATE TYPE "ContactSource" AS ENUM ('INTERNAL', 'EVENT', 'REQUEST');

-- AlterTable: existing contacts start as INTERNAL (admins and volunteers), then get backfilled below
ALTER TABLE "Contact" ADD COLUMN "source" "ContactSource" NOT NULL DEFAULT 'INTERNAL',
ADD COLUMN "sourceDetail" VARCHAR(60);

-- Backfill: event signups that aren't already admins or volunteers, tagged with their earliest event
UPDATE "Contact" c
SET "source" = 'EVENT',
    "sourceDetail" = (
      SELECT e."eventSlug"
      FROM "EarlyAccessSignup" e
      WHERE e."contactId" = c."id"
      ORDER BY e."createdAt" ASC
      LIMIT 1
    )
WHERE EXISTS (SELECT 1 FROM "EarlyAccessSignup" e WHERE e."contactId" = c."id")
  AND c."userProfileId" IS NULL
  AND NOT EXISTS (SELECT 1 FROM "VolunteerSignup" v WHERE v."contactId" = c."id");

-- Backfill: anyone who has submitted a request
UPDATE "Contact" c
SET "source" = 'REQUEST',
    "sourceDetail" = NULL
WHERE EXISTS (SELECT 1 FROM "Request" r WHERE r."contactId" = c."id");

-- Require an explicit source going forward
ALTER TABLE "Contact" ALTER COLUMN "source" DROP DEFAULT;
