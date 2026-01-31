/*
  Warnings:

  - You are about to drop the column `startTime` on the `OnRampTransaction` table. All the data in the column will be lost.
  - Added the required column `timestamp` to the `OnRampTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OnRampTransaction" DROP COLUMN "startTime",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "OnRampTransaction_userId_idx" ON "OnRampTransaction"("userId");

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE INDEX "p2pTransfer_fromUserId_idx" ON "p2pTransfer"("fromUserId");

-- CreateIndex
CREATE INDEX "p2pTransfer_toUserId_idx" ON "p2pTransfer"("toUserId");
