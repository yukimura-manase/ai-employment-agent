import { BasicLayout } from "@/components/layouts/basic-layout";
import { Button } from "@/components/shared/ui-elements/button";
import { useUserStates } from "@/stores/user";
import { useRouter } from "next/router";
import { ChatBox } from "./parts/chat-box";

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
      {/* AI エージェント Section */}
      <section className="w-[50%] h-full">
        <img src="/images/AI就活エージェント.png" alt="AI就活エージェント" />
      </section>

      {/* 会話 */}
      <section className="w-[50%] h-full flex flex-col gap-3 items-center justify-center">
        <div>
          <ChatBox />
        </div>

        <div>
          <Button onClick={() => router.push("/")}>トップページに戻る</Button>
        </div>
      </section>
    </BasicLayout>
  );
};
