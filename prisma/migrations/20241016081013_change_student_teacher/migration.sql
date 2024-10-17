/*
  Warnings:

  - A unique constraint covering the columns `[classroomCode]` on the table `Classroom` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Teacher` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `gender` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QuestionType" ADD VALUE 'WORDCLOUD';
ALTER TYPE "QuestionType" ADD VALUE 'TEXT';

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_userId_fkey";

-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "isCorrect" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Material" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL,
ALTER COLUMN "school" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_classroomCode_key" ON "Classroom"("classroomCode");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
