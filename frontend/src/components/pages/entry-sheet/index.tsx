import { BasicLayout } from "@/components/layouts/basic-layout";
import { Button } from "@/components/shared/ui-elements/button";
import { useUserStates } from "@/stores/user";
import { useRouter } from "next/router";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shared/ui-elements/sidebar";
import { AppSidebar } from "@/components/shared/ui-parts/app-sidebar.tsx";

export const EntrySheetPage = () => {
  const { user } = useUserStates();
  const router = useRouter();

  console.log("EntrySheetPage", user);

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
        <section className="w-full h-full flex flex-col gap-3 items-center justify-center">
          <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">エントリーシート作成</h1>
          </div>

          <div className="mt-5">
            <Button onClick={() => router.push("/")}>トップページに戻る</Button>
          </div>
        </section>
      </SidebarProvider>
    </BasicLayout>
  );
};
