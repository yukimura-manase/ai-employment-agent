import type { UserCurrentWork, UserTargetWork } from "@prisma/client";

/**
 * UserWorkProfile のレスポンス用型
 */
export interface UserWorkProfileRes {
  userWorkProfileId: string;
  userId: string;

  createdAt: string;
  updatedAt: string;

  // 必須項目
  userCurrentWork: UserCurrentWork;
  userTargetWork: UserTargetWork;
}
