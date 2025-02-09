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
  const [isLoading, setIsLoading] = useState(false);
  const [jobSearchResult, setJobSearchResult] = useState<string>("");

  const createJobSearch = async () => {
    setIsLoading(true);
    try {
      const jobSearch = await JobSearchApi.createJobSearch({
        userId: userId,
        userInformation: userInformation,
      });
      console.log("jobSearch", jobSearch);

      setJobSearchResult(jobSearch.text);
      alert("求人検索が完了しました🔍");
    } catch (error) {
      console.error("Error creating job search", error);
      alert("求人検索に失敗しました🔍");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, jobSearchResult, createJobSearch };
};
