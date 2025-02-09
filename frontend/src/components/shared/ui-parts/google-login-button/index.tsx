import { UserIdentity } from "@supabase/supabase-js";
import { useGoogleLogin } from "./hooks/useGoogleLogin";
import { useUserStates } from "@/stores/user";
import { UserRes } from "@/types/user/res/UserRes";

interface GoogleLoginButtonProps {
  userInfo: UserRes | null; // ブラウザで過去にログインしていたユーザー情報
}

/**
 * Google Login ボタン
 */
export const GoogleLoginButton = ({ userInfo }: GoogleLoginButtonProps) => {
  // setUser: ユーザー情報を global state に格納するために必要。
  const { user, setUser } = useUserStates();
  const { authUser, signInWithGoogle, signOutGoogleAuth } = useGoogleLogin({
    userInfo: user,
    setUser,
  });

  // ログインユーザー情報 (Google)
  const googleUser: UserIdentity | undefined = authUser?.identities
    ? authUser.identities[0]
    : undefined;

  return (
    <div className="flex gap-2">
      {googleUser && googleUser.identity_data && (
        <div className="flex items-center gap-2">
          <img
            src={googleUser.identity_data.avatar_url}
            alt={googleUser.identity_data.full_name}
            className="w-8 h-8 rounded-full"
          />
          <span>{googleUser.identity_data.full_name}</span>
        </div>
      )}
      {authUser ? (
        <button
          onClick={signOutGoogleAuth}
          className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-sm"
        >
          ログアウト
        </button>
      ) : (
        <button
          onClick={async () => await signInWithGoogle()}
          className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-sm"
        >
          Googleでログイン
        </button>
      )}
    </div>
  );
};
