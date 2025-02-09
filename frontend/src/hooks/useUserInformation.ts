import { UserWorkProfileApi } from "@/apis/userWorkProfileApi";
import { UserWorkProfileRes } from "@/types/user-work-profile/res/UserWorkProfileRes";
import { useEffect, useState } from "react";

interface UseUserInformationProps {
  userId: string;
}

/**
 * ユーザーの就活プロフィール情報を管理するためのフック
 * @returns ユーザーの情報: UserWorkProfileRes
 */
export const useUserInformation = ({ userId }: UseUserInformationProps) => {
  // ユーザーの就活プロフィール情報
  const [userInformation, setUserInformation] =
    useState<UserWorkProfileRes | null>(null);

  useEffect(() => {
    const fetchUserInformation = async () => {
      const userInformation = await UserWorkProfileApi.getUserWorkProfile(
        userId
      );
      setUserInformation(userInformation);
    };

    fetchUserInformation();
  }, [userId]);

  /**
   * ユーザーの就活プロフィール情報のキーを、日本語に翻訳する。
   */
  const keyTranslate = {
    // 現在の仕事に関するプロフィール情報
    currentIndustry: "現在の業界",
    currentJobType: "現在の職業",
    currentSalary: "現在の給与",
    currentCompany: "現在の会社",
    currentRole: "現在の役割",
    currentWorkStyle: "現在の働き方",

    // 目指す仕事に関するプロフィール情報
    targetIndustry: "目標の業界",
    targetJobType: "目標の職業",
    targetJobContent: "目標の仕事内容",
    targetSalary: "目標の給与",
    targetWorkStyle: "目標の働き方",
    targetCompany: "目標の会社",
    targetRole: "目標の役割",
    targetOtherConditions: "目標のその他の条件",
  };

  /**
   * ユーザーの就活プロフィール情報を、JSON形式でフォーマットする。
   *
   * 余計な情報は、非表示にする。
   */
  const formatUserWorkProfilePrompt = (
    userWorkProfile: UserWorkProfileRes | null
  ): string => {
    if (!userWorkProfile) {
      return "";
    }
    const { userCurrentWork, userTargetWork } = userWorkProfile;

    /**
     * ユーザーのプロフィール情報を、key: value の形式で文字列にフォーマットする。
     *
     * @param target 表示するプロフィール情報
     * @param excludeKeys 非表示にするキー
     */
    const formatKeyValueStr = (
      target: object,
      excludeKeys: string[]
    ): string => {
      const formattedStr = Object.entries(target)
        .map(([key, value]) => {
          // 値がない場合は、非表示にする。
          if (!value) {
            return;
          }
          // 余計な情報は、非表示にする。(id系, 作成日時, 更新日時など)
          if (excludeKeys.includes(key)) {
            return;
          }
          // key: value の形式にフォーマットする。(keyは、日本語に翻訳する)
          return `${keyTranslate[key as keyof typeof keyTranslate]}: ${value}`;
        })
        .filter((value) => value !== undefined) // undefined は、除外する。
        .join("\n");

      return formattedStr;
    };

    const commonKeys = [
      "userId",
      "userWorkProfileId",
      "createdAt",
      "updatedAt",
    ];

    // userCurrentWork を 1つずつ key: value の形式で表示する。
    const userCurrentWorkStr: string = formatKeyValueStr(userCurrentWork, [
      ...commonKeys,
      "userCurrentWorkId",
    ]);

    // userTargetWork を 1つずつ key: value の形式で表示する。
    const userTargetWorkStr: string = formatKeyValueStr(userTargetWork, [
      ...commonKeys,
      "userTargetWorkId",
    ]);

    return `
    お客さんの就活プロフィール情報: 
    * 現在の仕事: ${userCurrentWorkStr}
    * 目指す仕事: ${userTargetWorkStr}
  `;
  };

  const userInformationPrompt: string =
    formatUserWorkProfilePrompt(userInformation);

  return { userInformationPrompt };
};
