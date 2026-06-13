-- Remove ASSIGNED from RequestStatus: re-point rows, replace enum type.
UPDATE "Request" SET status = 'NEW' WHERE status = 'ASSIGNED';

CREATE TYPE "RequestStatus_new" AS ENUM ('NEW', 'FULFILLED', 'CONTACTED', 'UNCLAIMED', 'REDISTRIBUTED');

ALTER TABLE "Request" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Request" ALTER COLUMN "status" TYPE "RequestStatus_new" USING ("status"::text::"RequestStatus_new");

DROP TYPE "RequestStatus";
ALTER TYPE "RequestStatus_new" RENAME TO "RequestStatus";

ALTER TABLE "Request" ALTER COLUMN "status" SET DEFAULT 'NEW'::"RequestStatus";
