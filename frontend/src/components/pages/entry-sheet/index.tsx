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
import { EntrySheetMarkdownView } from "./parts/EntrySheetMarkdownView";
import { useUserInformation } from "@/hooks/useUserInformation";

export const EntrySheetPage = () => {
  const { user } = useUserStates();
  const router = useRouter();
  console.log("EntrySheetPage", user);

  const { userInformationPrompt } = useUserInformation({
    userId: user?.userId ?? "",
  });
  console.log("userInformationPrompt", userInformationPrompt);

  const { isLoading, createEntrySheet, entrySheetInfo } = useCreateEntrySheet({
    userId: user?.userId ?? "",
    userInformation: userInformationPrompt,
  });

  // Userが取得できていない場合は、Topページにリダイレクトする。
  if (!user) {
    router.push("/");
    return;
  }

  return (
    <BasicLayout>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        {/* 会話 */}
        <section className="w-full h-full flex flex-col gap-3 items-center justify-center">
          <div className="container mx-auto py-5">
            <h1 className="text-2xl font-bold mb-5 absolute top-[120px]">
              エントリーシート作成
              <p className="text-sm text-gray-500 mt-2">
                エントリーシート作成には、5~10秒ほどかかります。
              </p>
            </h1>
          </div>

          {/* エントリーシートのMarkdownを表示する */}
          {entrySheetInfo && (
            <EntrySheetMarkdownView entrySheet={entrySheetInfo.text} />
          )}

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
