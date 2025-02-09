import { BasicLayout } from "@/components/layouts/basic-layout";
import { Button } from "@/components/shared/ui-elements/button";
import { useUserStates } from "@/stores/user";
import { useRouter } from "next/router";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shared/ui-elements/sidebar";
import { AppSidebar } from "@/components/shared/ui-parts/app-sidebar.tsx";
import { useJobSearch } from "./hooks/useJobSearch";
import { useUserInformation } from "@/hooks/useUserInformation";
import { JobSearchResultView } from "./parts/JobSearchResultView";

export const JobSearchPage = () => {
  const { user } = useUserStates();
  const router = useRouter();

  const { userInformationPrompt } = useUserInformation({
    userId: user?.userId ?? "",
  });

  const { jobSearchResult, createJobSearch } = useJobSearch({
    userId: user?.userId ?? "",
    userInformation: userInformationPrompt,
  });

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
        <section className="w-full h-full flex flex-col gap-3 items-center justify-center">
          <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">求人検索</h1>
          </div>

          {/* 求人検索の結果を表示する */}
          {jobSearchResult && (
            <JobSearchResultView jobSearchResult={jobSearchResult} />
          )}

          <div className="flex justify-center gap-3">
            <Button onClick={() => createJobSearch()}>求人検索🔍</Button>
            <Button onClick={() => router.push("/")}>トップページに戻る</Button>
          </div>
        </section>
      </SidebarProvider>
    </BasicLayout>
  );
};
