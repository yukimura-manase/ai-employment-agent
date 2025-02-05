import {
  WorkStyle,
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

/*
  もしシンプルに同じインターフェースを使いたい場合は、
  UserWorkProfileRes = UserWorkProfile そのまま（createdAt/updatedAt を string | Date に統一）
  としてしまっても OK です。

  ただし、バックエンドが文字列で返してくる createdAt / updatedAt を
  そのまま string にするのか、それを受け取り次第フロントで Date に変換するのかは
  プロジェクトのルールに合わせて使い分けてください。
*/
