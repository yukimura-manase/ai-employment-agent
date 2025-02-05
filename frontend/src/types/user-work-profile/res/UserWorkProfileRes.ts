import {
  UserCareerHistory,
  UserSkill,
  UserCurrentWork,
  UserTargetWork,
} from "../UserWorkProfile";

/**
 * UserWorkProfile のレスポンス用型
 * - 取得時点でのデータそのままを想定
 * - createdAt, updatedAt はサーバーから文字列で返ってくるケースが多いため string にしている例です
 */
export interface UserWorkProfileRes {
  userWorkProfileId: string;
  userId: string;
  lastEducation: string;
  createdAt: string;
  updatedAt: string;
  userCareerHistories: (Omit<UserCareerHistory, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  })[];
  userSkills: (Omit<UserSkill, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  })[];
  userCurrentWork?: Omit<UserCurrentWork, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  };
  userTargetWork?: Omit<UserTargetWork, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
  };
}
