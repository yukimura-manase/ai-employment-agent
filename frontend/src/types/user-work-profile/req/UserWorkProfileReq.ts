import { WorkStyle } from "../UserWorkProfile";

/**
 * UserCareerHistory のリクエスト用型
 * - 更新時のみ ID を渡すなど、運用ルールに応じて調整してください
 */
export interface UserCareerHistoryReq {
  userCareerHistoryId?: string; // 更新時は必要になることを想定
  company: string;
  role: string;
  startDate: string | Date;
  endDate?: string | Date;
  description?: string;
}

/**
 * UserSkill のリクエスト用型
 */
export interface UserSkillReq {
  userSkillId?: string; // 更新時は必要になることを想定
  skillName: string;
}

/**
 * UserCurrentWork のリクエスト用型
 */
export interface UserCurrentWorkReq {
  userCurrentWorkId?: string; // 更新時は必要になることを想定
  currentIndustry: string;
  currentJobType: string;
  currentSalary: number;
  currentCompany: string;
  currentRole: string;
  currentWorkStyle: WorkStyle;
}

/**
 * UserTargetWork のリクエスト用型
 */
export interface UserTargetWorkReq {
  userTargetWorkId?: string;
  targetIndustry: string;
  targetJobType: string;
  targetJobContent: string;
  targetSalary: number;
  targetWorkStyle: WorkStyle;
  targetCompany: string;
  targetRole: string;
  targetOtherConditions: string;
}

/**
 * UserWorkProfile のリクエスト用型
 * - userId は既存ユーザーに対して必須など、ルールに合わせて調整してください。
 * - userCareerHistories / userSkills / userCurrentWork / userTargetWork は、
 *   必要に応じて部分更新する際は optional にする等調整が必要です。
 */
export interface UserWorkProfileReq {
  userWorkProfileId?: string; // 更新時は必要になることを想定
  userId: string;
  lastEducation: string;
  userCareerHistories?: UserCareerHistoryReq[];
  userSkills?: UserSkillReq[];
  userCurrentWork?: UserCurrentWorkReq;
  userTargetWork?: UserTargetWorkReq;
}
