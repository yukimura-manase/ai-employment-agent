import { JobSearchApi } from "@/apis/jobSearchApi";
import { useState } from "react";

interface UseJobSearchProps {
  userId: string;
  userInformation: string;
}

/**
 * 求人検索を管理するためのフック
 * @returns jobSearchResult: 求人検索結果, createJobSearch: 求人検索を作成する関数
 */
export const useJobSearch = ({
  userId,
  userInformation,
}: UseJobSearchProps) => {
  const [jobSearchResult, setJobSearchResult] = useState<string>("");

  const createJobSearch = async () => {
    const jobSearch = await JobSearchApi.createJobSearch({
      userId: userId,
      userInformation: userInformation,
    });
    setJobSearchResult(jobSearch.text);
  };

  return { jobSearchResult, createJobSearch };
};
