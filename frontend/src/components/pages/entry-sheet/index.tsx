import { BasicLayout } from "@/components/layouts/basic-layout";
import { Button } from "@/components/shared/ui-elements/button";
import { useUserStates } from "@/stores/user";
import { useRouter } from "next/router";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shared/ui-elements/sidebar";
import { AppSidebar } from "@/components/shared/ui-parts/app-sidebar.tsx";
import { useCreateEntrySheet } from "./hooks/useCreateEntrySheet";
import { Loading } from "@/components/shared/ui-elements/loading/Loading";
import { useUserInformation } from "./hooks/useUserInformation";

export const EntrySheetPage = () => {
  const { user } = useUserStates();
  const router = useRouter();
  console.log("EntrySheetPage", user);

  const { userInformationPrompt } = useUserInformation({
    userId: user?.userId ?? "",
  });
  console.log("userInformationPrompt", userInformationPrompt);

  const { isLoading, createEntrySheet } = useCreateEntrySheet({
    userId: user?.userId ?? "",
    userInformation: userInformationPrompt,
  });

  // User取得まで、ローディングを表示する。
  // if (!user) {
  //   return <Loading />;
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
            {isLoading ? (
              <Loading />
            ) : (
              <div className="flex justify-center gap-3">
                <Button onClick={() => createEntrySheet()}>
                  エントリーシート作成
                </Button>
                <Button onClick={() => router.push("/")}>
                  トップページに戻る
                </Button>
              </div>
            )}
          </div>
        </section>
      </SidebarProvider>
    </BasicLayout>
  );
};
