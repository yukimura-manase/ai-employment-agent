import { useState, useEffect, useCallback } from "react";
import { supabaseClient } from "@/libs/supabase";
import { Session, User, UserIdentity } from "@supabase/supabase-js";
import { UserApi } from "@/apis/userAPI";
import { UserRes } from "@/types/user/res/UserRes";

interface UseGoogleLoginProps {
  setUser: (user: UserRes) => void;
}

export const useGoogleLogin = ({ setUser }: UseGoogleLoginProps) => {
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
   * ユーザー登録 API をCallする。
   */
  const registerUser = async (
    email: string,
    full_name: string
  ): Promise<UserRes> => {
    return await UserApi.createUser({ email, name: full_name });
  };

  /**
   * ユーザー情報を取得して state に格納 & ユーザー登録を実施する。
   */
  const fetchUser = useCallback(async () => {
    try {
      const { data, error } = await supabaseClient.auth.getUser();
      if (error) {
        throw new Error(error.message);
      }
      setAuthUser(data?.user ?? null);

      // ユーザー情報が取得できた場合、ユーザー登録を行う。
      if (data?.user) {
        // ログインユーザー情報 (Google)
        const user: UserIdentity | undefined = data.user?.identities
          ? data.user?.identities[0]
          : undefined;

        if (user && user.identity_data) {
          // console.log("user", user);
          const resUser = await registerUser(
            user.identity_data.email,
            user.identity_data.full_name
          );

          setUser(resUser);
        }
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  }, []);

  // セッション情報を取得して state に格納
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
    // 初回マウント時にユーザー・セッション情報を取得
    fetchUser();
    fetchSession();

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
