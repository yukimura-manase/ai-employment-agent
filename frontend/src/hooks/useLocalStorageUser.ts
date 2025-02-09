import { UserApi } from "@/apis/userApi";
import { UserRes } from "@/types/user/res/UserRes";
import { useEffect } from "react";

interface UseUserProps {
  setUser: (user: UserRes) => void;
}

/**
 * LocalStorageに、Loginユーザーの情報が残っていれば、それでユーザー情報を取得する。
 */
export const useLocalStorageUser = ({ setUser }: UseUserProps) => {
  /**
   * 特定のユーザーをDBから取得する。
   */
  const getUser = async (userId: string): Promise<UserRes | null> => {
    return await UserApi.getUser(userId);
  };

  useEffect(() => {
    // LocalStorageのuserIdを取得する。
    const userId = localStorage.getItem("userId");
    // LocalStorageに、Loginユーザーの情報が残っていない場合は、何もしない。
    if (!userId) {
      return;
    }

    // LocalStorageに、Loginユーザーの情報が残っていれば、
    // それをユーザー情報を取得 & GlobalStateに格納する。
    const fetchUser = async (userId: string): Promise<void> => {
      const user: UserRes | null = await getUser(userId);
      user && setUser(user);
    };

    fetchUser(userId);
  }, []);

  return {};
};
