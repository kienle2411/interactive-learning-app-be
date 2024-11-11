/*
  Warnings:

  - The primary key for the `StudentInGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `classroomId` on the `StudentInGroup` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentInGroup" DROP CONSTRAINT "StudentInGroup_classroomId_fkey";

-- AlterTable
ALTER TABLE "StudentInGroup" DROP CONSTRAINT "StudentInGroup_pkey",
DROP COLUMN "classroomId",
ADD CONSTRAINT "StudentInGroup_pkey" PRIMARY KEY ("studentId", "groupId");
