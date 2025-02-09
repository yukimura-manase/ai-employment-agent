import { useState } from "react";
import { EntrySheetApi } from "@/apis/entrySheetApi";
import { CreateEntrySheetReq } from "@/types/entrysheet/req/EntrySheetReq";
import { SYSTEM_PROMPT } from "@/constants/systemPrompt";
import { CreateEntrySheetRes } from "@/types/entrysheet/res/EntrySheetRes";

interface UseCreateEntrySheetProps {
  userId: string;
  userInformation: string;
}

/**
 * エントリーシート作成 Hook
 */
export const useCreateEntrySheet = ({
  userId,
  userInformation,
}: UseCreateEntrySheetProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [entrySheetInfo, setEntrySheetInfo] =
    useState<CreateEntrySheetRes | null>(null);

  const toCreateEntrySheetReq = () => {
    return {
      userId,
      userInformation,
      // systemPrompt: SYSTEM_PROMPT, // いったん、固定値。
      // needProperties: {}, // いったん、空。
    };
  };

  const createEntrySheet = async () => {
    if (!userId) {
      return;
    }

    setIsLoading(true);
    const req = toCreateEntrySheetReq();
    try {
      const res: CreateEntrySheetRes = await EntrySheetApi.createEntrySheet(
        req
      );
      setEntrySheetInfo(res);
    } catch (error) {
      console.error(error);
      alert("エントリーシートの作成に失敗しました。");
      // TODO: その他、エラーハンドリング
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, createEntrySheet, entrySheetInfo };
};
