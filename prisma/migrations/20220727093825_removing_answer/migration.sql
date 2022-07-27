/*
  Warnings:

  - You are about to drop the `Answers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Answers" DROP CONSTRAINT "Answers_questionId_fkey";

-- AlterTable
ALTER TABLE "Questions" ALTER COLUMN "weight" DROP DEFAULT;

-- DropTable
DROP TABLE "Answers";
