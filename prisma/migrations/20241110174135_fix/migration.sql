/*
  Warnings:

  - The primary key for the `StudentInGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `classroomId` to the `StudentInGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentInGroup" DROP CONSTRAINT "StudentInGroup_pkey",
ADD COLUMN     "classroomId" TEXT NOT NULL,
ADD CONSTRAINT "StudentInGroup_pkey" PRIMARY KEY ("studentId", "groupId", "classroomId");

-- AddForeignKey
ALTER TABLE "StudentInGroup" ADD CONSTRAINT "StudentInGroup_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
