import { WorkProfileForm } from "./parts/WorkProfileForm";
import { BasicLayout } from "@/components/layouts/basic-layout";
import { Button } from "@/components/shared/ui-elements/button";
import { useUserStates } from "@/stores/user";
import { useRouter } from "next/router";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shared/ui-elements/sidebar";
import { AppSidebar } from "@/components/shared/ui-parts/app-sidebar.tsx";

/**
 * ユーザーの就活プロフィールを作成するページ
 *
 * - 作成したプロフィールの閲覧ができる。
 * - プロフィールの編集ができる。
 */
export const UserWorkProfilePage = () => {
  const { user } = useUserStates();
  const router = useRouter();

  // ログインしていない場合は、Topページにリダイレクトする。
  // if (!user) {
  //   router.push("/");
  //   return;
  // }

  return (
    <BasicLayout>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        {/* 会話 */}
        <section className="w-full h-full flex flex-col gap-3 items-center justify-center my-5">
          <div className="container mx-auto py-10 w-[80%]">
            <h1 className="text-2xl font-bold mb-5">就活プロフィール情報📝</h1>
            <WorkProfileForm />
          </div>

          <div className="mt-5">
            <Button onClick={() => router.push("/")}>トップページに戻る</Button>
          </div>
        </section>
      </SidebarProvider>
    </BasicLayout>
  );
};
