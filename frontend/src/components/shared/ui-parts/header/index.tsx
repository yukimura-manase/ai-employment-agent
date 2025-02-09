import { useState } from "react";
import { TbRobot } from "react-icons/tb";
import { GoogleLoginButton } from "../google-login-button";
import { useRouter } from "next/router";
import { useUserStates } from "@/stores/user";
import { useLocalStorageUser } from "./hooks/useUser";

/**
 * ページ共通のHeader
 *
 * 一番最初にレンダリングされるComponentの1つであるため、ここでUser情報の管理をする。
 *    - ログインユーザーのユーザー情報を取得する。
 *    - Google Login 周りの処理を行う。
 */
export const Header = () => {
  const router = useRouter();
  // setUser: ユーザー情報を global state に格納するために必要。
  const { user, setUser } = useUserStates();
  useLocalStorageUser({ setUser });

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white relative z-[999]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <TbRobot className="w-8 h-8" />
          <h1 className="text-2xl font-bold">AI就活エージェント</h1>
        </div>

        <nav className="hidden md:flex space-x-4">
          <GoogleLoginButton userInfo={user} />
        </nav>
      </div>
    </header>
  );
};
