/*
  Warnings:

  - You are about to drop the `sessionview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "sessionview";

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "description" TEXT,
    "sessionDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "classroomId" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);
