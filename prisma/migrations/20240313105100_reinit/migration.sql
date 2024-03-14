/*
  Warnings:

  - You are about to drop the column `image` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the column `video` on the `Tweet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "image",
DROP COLUMN "video",
ADD COLUMN     "media" TEXT;
