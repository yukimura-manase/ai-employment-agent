import { UserWorkProfileApi } from "@/apis/userWorkProfileApi";
import { UserWorkProfileRes } from "@/types/user-work-profile/res/UserWorkProfileRes";
import { useEffect, useState } from "react";

interface UseWorkProfileProps {
  userId: string;
}

/**
 * ユーザーの就活プロフィール情報を管理するためのフック
 * @returns ユーザーの就活プロフィール情報
 */
export const useWorkProfile = ({ userId }: UseWorkProfileProps) => {
  // ユーザーの就活プロフィール情報
  const [workProfile, setWorkProfile] = useState<UserWorkProfileRes | null>(
    null
  );

  useEffect(() => {
    const fetchWorkProfile = async () => {
      const workProfile = await UserWorkProfileApi.getUserWorkProfile(userId);
      setWorkProfile(workProfile);
    };

    fetchWorkProfile();
  }, [userId]);

  return workProfile;
};
