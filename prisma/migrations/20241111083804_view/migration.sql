/*
  Warnings:

  - You are about to drop the `SessionView` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "SessionView";

-- CreateTable
CREATE TABLE "sessionview" (
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

    CONSTRAINT "sessionview_pkey" PRIMARY KEY ("id")
);
