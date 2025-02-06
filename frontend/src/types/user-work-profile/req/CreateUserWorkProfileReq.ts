import { WorkStyle } from "../UserWorkProfile";

/**
 * UserWorkProfile の Create Req
 *
 * - 初回登録時は、DB Recordを作成するために、すべて必須。
 */
export interface CreateUserWorkProfileReq {
  userId: string;

  // 必須項目
  userCurrentWork: CreateUserCurrentWorkReq; // 現在の職業
  userTargetWork: CreateUserTargetWorkReq; // 目標の職業
  // userSkills: CreateUserSkillReq[]; // スキル

  // 任意項目
  // lastEducation?: string; // 最終学歴
  // userCareerHistories?: CreateUserCareerHistoryReq[]; // 職務経歴
}

/**
 * 職務経歴 のリクエスト用型
 *
 */
export interface CreateUserCareerHistoryReq {
  company: string;
  role: string;
  startDate: string | Date;
  endDate?: string | Date;
  description?: string;
}

/**
 * スキル のリクエスト用型
 */
export interface CreateUserSkillReq {
  skillName: string;
}

/**
 * 現在の職業 のリクエスト用型
 */
export interface CreateUserCurrentWorkReq {
  currentIndustry: string;
  currentJobType: string;
  currentSalary: number;
  currentCompany: string;
  currentRole: string;
  currentWorkStyle: WorkStyle;
}

/**
 * 目標の職業 のリクエスト用型
 */
export interface CreateUserTargetWorkReq {
  targetIndustry: string;
  targetJobType: string;
  targetJobContent: string;
  targetSalary: number;
  targetWorkStyle: WorkStyle;
  targetCompany: string;
  targetRole: string;
  targetOtherConditions?: string;
}
