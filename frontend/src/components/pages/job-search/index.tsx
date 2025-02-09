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
import { Loading } from "@/components/shared/ui-elements/loading/Loading";

export const JobSearchPage = () => {
  const { user } = useUserStates();
  const router = useRouter();

  const { userInformationPrompt } = useUserInformation({
    userId: user?.userId ?? "",
  });

  const { isLoading, jobSearchResult, createJobSearch } = useJobSearch({
    userId: user?.userId ?? "",
    userInformation: userInformationPrompt,
  });

  // ログインしていない場合は、Topページにリダイレクトする。
  if (!user) {
    router.push("/");
    return;
  }

  return (
    <BasicLayout>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <section className="w-full h-[80%] flex flex-col gap-3 items-center justify-center">
          <div className="container mx-auto py-5">
            <h1 className="text-2xl font-bold mb-5 absolute top-[120px]">
              求人検索
              <p className="text-sm text-gray-500 mt-2">
                求人検索には、10~30秒ほどかかります。
              </p>
            </h1>
          </div>

          {/* 求人検索の結果を表示する */}
          {jobSearchResult && (
            <JobSearchResultView jobSearchResult={jobSearchResult} />
          )}

          {isLoading ? (
            <Loading />
          ) : (
            <div className="mt-3 flex justify-center gap-3">
              <Button onClick={() => createJobSearch()}>求人検索🔍</Button>
              <Button onClick={() => router.push("/")}>
                トップページに戻る
              </Button>
            </div>
          )}
        </section>
      </SidebarProvider>
    </BasicLayout>
  );
};
