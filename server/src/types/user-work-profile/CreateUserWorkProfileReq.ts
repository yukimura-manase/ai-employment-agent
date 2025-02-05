import { WorkStyle } from "@prisma/client";

/**
 * UserWorkProfile の Create Req
 *
 * - 初回登録時は、DB Recordを作成するために、すべて必須。
 */
export interface CreateUserWorkProfileReq {
  userId: string;

  // 既存の UserWorkProfile がある場合は、その ID を指定する。
  userWorkProfileId?: string;

  // 必須項目
  userCurrentWork: CreateUserCurrentWorkReq; // 現在の職業
  userTargetWork: CreateUserTargetWorkReq; // 目標の職業
  // userSkills: CreateUserSkillReq[]; // スキル

  // TODO: 任意項目のデータは、後で追加する。
  // lastEducation?: string; // 最終学歴
  // userCareerHistories?: CreateUserCareerHistoryReq[]; // 職務経歴
}

/**
 * スキル のリクエスト用型
 */
export interface CreateUserSkillReq {
  // 既存の UserWorkProfile がある場合は、その ID を指定する。
  userWorkProfileId?: string;

  skillName: string;
}

/**
 * 現在の職業 のリクエスト用型
 */
export interface CreateUserCurrentWorkReq {
  // 既存の UserWorkProfile がある場合は、その ID を指定する。
  userWorkProfileId?: string;

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
  // 既存の UserWorkProfile がある場合は、その ID を指定する。
  userWorkProfileId?: string;

  targetIndustry: string;
  targetJobType: string;
  targetJobContent: string;
  targetSalary: number;
  targetWorkStyle: WorkStyle;
  targetCompany: string;
  targetRole: string;
  targetOtherConditions?: string; // その他の希望条件
}

/**
 * 職務経歴 のリクエスト用型
 *
 */
export interface CreateUserCareerHistoryReq {
  // 既存の UserWorkProfile がある場合は、その ID を指定する。
  userWorkProfileId?: string;

  company: string;
  role: string;
  startDate: string | Date;
  endDate?: string | Date;
  description?: string;
}
