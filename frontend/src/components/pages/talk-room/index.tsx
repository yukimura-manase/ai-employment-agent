import { BasicLayout } from "@/components/layouts/basic-layout";
import { Button } from "@/components/shared/ui-elements/button";
import { useUserStates } from "@/stores/user";
import { useRouter } from "next/router";
import { ChatBox } from "./parts/chat-box";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shared/ui-elements/sidebar";
import { AppSidebar } from "@/components/shared/ui-parts/app-sidebar.tsx";
import { Loading } from "@/components/shared/ui-elements/loading/Loading";

export const TalkRoomPage = () => {
  const { user } = useUserStates();
  const router = useRouter();

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
        {/* 会話 */}
        <section className="w-full h-full flex flex-col gap-3 items-center justify-center">
          <div>
            <ChatBox user={user} />
          </div>

          <div className="mt-5">
            <Button onClick={() => router.push("/")}>トップページに戻る</Button>
          </div>
        </section>
      </SidebarProvider>
    </BasicLayout>
  );
};
