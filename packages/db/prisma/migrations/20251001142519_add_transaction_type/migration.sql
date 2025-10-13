-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('CREDIT', 'DEBIT');

-- AlterTable
ALTER TABLE "public"."OnRampTransaction" ADD COLUMN     "type" "public"."TransactionType" NOT NULL DEFAULT 'CREDIT';
