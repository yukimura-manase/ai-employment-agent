/*
  Warnings:

  - Made the column `currentSalary` on table `UserCurrentWork` required. This step will fail if there are existing NULL values in that column.
  - Made the column `targetSalary` on table `UserTargetWork` required. This step will fail if there are existing NULL values in that column.
  - Made the column `targetWorkStyle` on table `UserTargetWork` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserCurrentWork" ALTER COLUMN "currentSalary" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserTargetWork" ALTER COLUMN "targetSalary" SET NOT NULL,
ALTER COLUMN "targetWorkStyle" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserWorkProfile" ALTER COLUMN "lastEducation" DROP NOT NULL;
