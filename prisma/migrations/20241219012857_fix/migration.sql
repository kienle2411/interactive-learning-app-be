-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "presentationId" TEXT;

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
    "presentationId" TEXT NOT NULL,

    CONSTRAINT "sessionview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_presentationId_fkey" FOREIGN KEY ("presentationId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;
