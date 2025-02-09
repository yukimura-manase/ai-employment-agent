import { useState, useEffect, useCallback } from "react";
import { supabaseClient } from "@/libs/supabase";
import { AuthError, Session, User, UserIdentity } from "@supabase/supabase-js";
import { UserApi } from "@/apis/userApi";
import { UserRes } from "@/types/user/res/UserRes";

interface UseGoogleLoginProps {
  userInfo: UserRes | null;
  setUser: (user: UserRes) => void;
}

export const useGoogleLogin = ({ userInfo, setUser }: UseGoogleLoginProps) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authSession, setAuthSession] = useState<Session | null>(null);

  /**
   * Supabase Auth Googleログイン
   *
   * - Supabase Auth で Google ログインを行う。
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      console.error("Error signing in:", err);
    }
  }, []);

  /**
   * Supabase Auth ログアウト
   */
  const signOutGoogleAuth = useCallback(async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }, []);

  /**
   * 特定のユーザーをDBから取得する。
   */
  const getUser = async (userId: string): Promise<UserRes | null> => {
    return await UserApi.getUser(userId);
  };

  /**
   * ユーザーをDBに登録する。
   */
  const registerUser = async (
    email: string,
    full_name: string
  ): Promise<UserRes> => {
    return await UserApi.createUser({ email, name: full_name });
  };

  /**
   * ユーザー情報を取得して state に格納 & ユーザー登録を実施する。
   *
   * - supabaseから、ログインユーザー情報を取得する。
   * - ログインユーザー情報が取得できた場合、ユーザー登録を行う。
   * - ユーザー登録がDBになければ、DBに登録する。
   */
  const fetchUser = useCallback(async () => {
    try {
      // Googleユーザー情報を取得する。
      const { data, error } = await supabaseClient.auth.getUser();
      if (error) {
        // AuthErrorの場合は、error throwしない。
        if (error instanceof AuthError) {
          console.warn("error.message", error.message);
          return;
        }
        throw new Error(error);
      }
      setAuthUser(data?.user ?? null);

      /** Googleログインユーザー情報 */
      const user: UserIdentity | undefined = data.user?.identities
        ? data.user?.identities[0]
        : undefined;

      // UserInfoがある場合は、DBに登録はしない。
      if (userInfo) {
        return;
      }

      // DBに登録されていない場合は、Googleユーザー情報から、ユーザー登録を行う。
      if (user && user.identity_data) {
        // Googleログインユーザー情報から、ユーザー登録を行う。
        // Googleのemailとfull_nameは、そのまま登録する。
        const resUser = await registerUser(
          user.identity_data.email,
          user.identity_data.full_name
        );

        // ユーザー情報を GlobalState に格納
        setUser(resUser);

        // LocalStorageに、Loginユーザーの情報を保存する。
        localStorage.setItem("userId", resUser.userId);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  }, []);

  /**
   * セッション情報を取得して state に格納
   */
  const fetchSession = useCallback(async () => {
    try {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) {
        throw new Error(error.message);
      }
      setAuthSession(data?.session ?? null);
    } catch (err) {
      console.error("Error fetching session:", err);
    }
  }, []);

  useEffect(() => {
    // 初回マウント時にユーザー・セッション情報を取得する。
    const bulkFetch = async () => {
      await Promise.all([fetchUser(), fetchSession()]);
    };
    bulkFetch();

    // 認証状態が変化したときに state を更新
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session);
      setAuthUser(session?.user ?? null);
    });

    // クリーンアップ
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUser, fetchSession]);

  return {
    authUser,
    authSession,
    signInWithGoogle,
    signOutGoogleAuth,
    fetchUser,
    fetchSession,
  };
};
