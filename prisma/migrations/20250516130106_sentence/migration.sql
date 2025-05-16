/*
  Warnings:

  - A unique constraint covering the columns `[text]` on the table `Sentence` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sentence_text_key" ON "Sentence"("text");
