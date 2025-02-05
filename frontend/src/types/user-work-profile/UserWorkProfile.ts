/**
 * UserWorkProfile
 */
export interface UserWorkProfile {
  userWorkProfileId: string;
  userId: string;
  lastEducation: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  userCareerHistories: UserCareerHistory[];
  userSkills: UserSkill[];
  userCurrentWork?: UserCurrentWork;
  userTargetWork?: UserTargetWork;
}

/**
 * 働き方の種類を表す enum
 */
export enum WorkStyle {
  REMOTE = "REMOTE", // フルリモート
  HYBRID = "HYBRID", // ハイブリッド
  ONSITE = "ONSITE", // 契約社員
  FREELANCE = "FREELANCE", // フリーランス
}

/**
 * UserCareerHistory
 */
export interface UserCareerHistory {
  userCareerHistoryId: string;
  userId: string;
  userWorkProfileId: string;
  company: string;
  role: string;
  startDate: string | Date; // API レスポンスをそのまま受け取る場合は string、パース済みなら Date
  endDate?: string | Date;
  description?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * UserSkill
 */
export interface UserSkill {
  userSkillId: string;
  userId: string;
  userWorkProfileId: string;
  skillName: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * UserCurrentWork
 */
export interface UserCurrentWork {
  userCurrentWorkId: string;
  userId: string;
  userWorkProfileId: string;
  currentIndustry: string;
  currentJobType: string;
  currentSalary: number;
  currentCompany: string;
  currentRole: string;
  currentWorkStyle: WorkStyle;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * UserTargetWork
 */
export interface UserTargetWork {
  userTargetWorkId: string;
  userId: string;
  userWorkProfileId: string;
  targetIndustry: string;
  targetJobType: string;
  targetJobContent: string;
  targetSalary: number;
  targetWorkStyle: WorkStyle;
  targetCompany: string;
  targetRole: string;
  targetOtherConditions: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
