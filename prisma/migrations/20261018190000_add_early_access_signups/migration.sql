-- CreateTable
CREATE TABLE "EarlyAccessSignup" (
    "id" TEXT NOT NULL,
    "eventSlug" VARCHAR(60) NOT NULL,
    "contactId" TEXT NOT NULL,
    "preferredDayKey" VARCHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EarlyAccessSignup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EarlyAccessSignup_eventSlug_contactId_key" ON "EarlyAccessSignup"("eventSlug", "contactId");

-- AddForeignKey
ALTER TABLE "EarlyAccessSignup" ADD CONSTRAINT "EarlyAccessSignup_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

