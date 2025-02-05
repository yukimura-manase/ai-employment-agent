-- AlterTable
ALTER TABLE "UserCurrentWork" ALTER COLUMN "currentSalary" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserTargetWork" ALTER COLUMN "targetSalary" DROP NOT NULL,
ALTER COLUMN "targetWorkStyle" DROP NOT NULL,
ALTER COLUMN "targetCompany" DROP NOT NULL,
ALTER COLUMN "targetRole" DROP NOT NULL,
ALTER COLUMN "targetOtherConditions" DROP NOT NULL;
