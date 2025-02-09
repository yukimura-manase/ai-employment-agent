import { ReactNode } from "react";
import { Header } from "@/components/shared/ui-parts/header";
import { useUserStates } from "@/stores/user";
import { useLocalStorageUser } from "@/hooks/useLocalStorageUser";

/**
 * 共通のBasic Layout
 *
 * - Header
 * - Main Area
 */
export const BasicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex gap-2">{children}</main>
    </div>
  );
};
