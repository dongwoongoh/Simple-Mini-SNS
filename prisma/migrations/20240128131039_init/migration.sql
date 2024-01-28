/*
  Warnings:

  - You are about to drop the `Heart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Heart" DROP CONSTRAINT "Heart_memberId_fkey";

-- DropTable
DROP TABLE "Heart";

-- CreateTable
CREATE TABLE "hearts" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "chargedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hearts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "hearts" ADD CONSTRAINT "hearts_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
