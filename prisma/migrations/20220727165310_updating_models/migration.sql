/*
  Warnings:

  - A unique constraint covering the columns `[question]` on the table `Questions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Questions_question_key" ON "Questions"("question");
