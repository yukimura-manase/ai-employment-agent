-- CreateEnum
CREATE TYPE "WorkStyle" AS ENUM ('REMOTE', 'HYBRID', 'ONSITE', 'FREELANCE');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "sender" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "UserWorkProfile" (
    "userWorkProfileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastEducation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserWorkProfile_pkey" PRIMARY KEY ("userWorkProfileId")
);

-- CreateTable
CREATE TABLE "UserCareerHistory" (
    "userCareerHistoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userWorkProfileId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCareerHistory_pkey" PRIMARY KEY ("userCareerHistoryId")
);

-- CreateTable
CREATE TABLE "UserSkill" (
    "userSkillId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userWorkProfileId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSkill_pkey" PRIMARY KEY ("userSkillId")
);

-- CreateTable
CREATE TABLE "UserCurrentWork" (
    "userCurrentWorkId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userWorkProfileId" TEXT NOT NULL,
    "currentIndustry" TEXT NOT NULL,
    "currentJobType" TEXT NOT NULL,
    "currentSalary" INTEGER NOT NULL,
    "currentCompany" TEXT NOT NULL,
    "currentRole" TEXT NOT NULL,
    "currentWorkStyle" "WorkStyle" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCurrentWork_pkey" PRIMARY KEY ("userCurrentWorkId")
);

-- CreateTable
CREATE TABLE "UserTargetWork" (
    "userTargetWorkId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userWorkProfileId" TEXT NOT NULL,
    "targetIndustry" TEXT NOT NULL,
    "targetJobType" TEXT NOT NULL,
    "targetJobContent" TEXT NOT NULL,
    "targetSalary" INTEGER NOT NULL,
    "targetWorkStyle" "WorkStyle" NOT NULL,
    "targetCompany" TEXT NOT NULL,
    "targetRole" TEXT NOT NULL,
    "targetOtherConditions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTargetWork_pkey" PRIMARY KEY ("userTargetWorkId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserWorkProfile_userId_key" ON "UserWorkProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCurrentWork_userId_key" ON "UserCurrentWork"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCurrentWork_userWorkProfileId_key" ON "UserCurrentWork"("userWorkProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTargetWork_userId_key" ON "UserTargetWork"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTargetWork_userWorkProfileId_key" ON "UserTargetWork"("userWorkProfileId");

-- AddForeignKey
ALTER TABLE "UserWorkProfile" ADD CONSTRAINT "UserWorkProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCareerHistory" ADD CONSTRAINT "UserCareerHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCareerHistory" ADD CONSTRAINT "UserCareerHistory_userWorkProfileId_fkey" FOREIGN KEY ("userWorkProfileId") REFERENCES "UserWorkProfile"("userWorkProfileId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_userWorkProfileId_fkey" FOREIGN KEY ("userWorkProfileId") REFERENCES "UserWorkProfile"("userWorkProfileId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCurrentWork" ADD CONSTRAINT "UserCurrentWork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCurrentWork" ADD CONSTRAINT "UserCurrentWork_userWorkProfileId_fkey" FOREIGN KEY ("userWorkProfileId") REFERENCES "UserWorkProfile"("userWorkProfileId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTargetWork" ADD CONSTRAINT "UserTargetWork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTargetWork" ADD CONSTRAINT "UserTargetWork_userWorkProfileId_fkey" FOREIGN KEY ("userWorkProfileId") REFERENCES "UserWorkProfile"("userWorkProfileId") ON DELETE RESTRICT ON UPDATE CASCADE;
