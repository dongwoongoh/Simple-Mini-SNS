-- CreateTable
CREATE TABLE "Heart" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "chargedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Heart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Heart" ADD CONSTRAINT "Heart_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
