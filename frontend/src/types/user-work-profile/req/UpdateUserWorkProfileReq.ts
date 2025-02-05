import { WorkStyle } from "../UserWorkProfile";

/**
 * UserWorkProfile のリクエスト用型
 *
 * - 更新の場合は、基本的にOptional
 */
export interface UpdateUserWorkProfileReq {
  userWorkProfileId: string;
  userId: string;

  lastEducation: string;
  userCareerHistories?: UpdateUserCareerHistoryReq[];
  userSkills?: UpdateUserSkillReq[];
  userCurrentWork?: UpdateUserCurrentWorkReq;
  userTargetWork?: UpdateUserTargetWorkReq;
}

/**
 * UserCareerHistory のリクエスト用型
 */
export interface UpdateUserCareerHistoryReq {
  userCareerHistoryId: string;
  company: string;
  role: string;
  startDate: string | Date;
  endDate?: string | Date;
  description?: string;
}

/**
 * UserSkill のリクエスト用型
 */
export interface UpdateUserSkillReq {
  userSkillId: string;
  skillName: string;
}

/**
 * UserCurrentWork のリクエスト用型
 */
export interface UpdateUserCurrentWorkReq {
  userCurrentWorkId: string;
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
export interface UpdateUserTargetWorkReq {
  userTargetWorkId: string;
  targetIndustry: string;
  targetJobType: string;
  targetJobContent: string;
  targetSalary: number;
  targetWorkStyle: WorkStyle;
  targetCompany: string;
  targetRole: string;
  targetOtherConditions: string;
}
