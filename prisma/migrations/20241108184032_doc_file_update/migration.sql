/*
  Warnings:

  - Added the required column `fileName` to the `DocFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DocFile" ADD COLUMN     "fileName" TEXT NOT NULL;
