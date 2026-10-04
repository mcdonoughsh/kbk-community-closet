-- AlterTable: backfill existing slots, then require title going forward
ALTER TABLE "VolunteerSlot" ADD COLUMN "title" VARCHAR(120) NOT NULL DEFAULT 'Volunteer Day';
ALTER TABLE "VolunteerSlot" ALTER COLUMN "title" DROP DEFAULT;
