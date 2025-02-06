import { BasicLayout } from "@/components/layouts/basic-layout";
import { Button } from "@/components/shared/ui-elements/button";
import { useUserStates } from "@/stores/user";
import { useRouter } from "next/router";

export const HomePage = () => {
  const { user } = useUserStates();
  const router = useRouter();

  return (
    <BasicLayout>
      {/* AI エージェント Section */}
      <section className="w-[50%] h-full">
        <img src="/images/AI就活エージェント.png" alt="AI就活エージェント" />
      </section>

      {/* ログインする */}
      <section className="w-[50%] h-full flex flex-col gap-3 items-center justify-center">
        <h2 className="flex items-center justify-center font-bold text-2xl">
          AI就活エージェント
        </h2>
        {/* ログインしていない場合 */}
        {!user && <p>ログインして、AI就活エージェントに相談してみよう！</p>}

        {/* ログインしている場合 */}
        {user && (
          <div className="flex flex-col gap-3 items-center">
            <p>ようこそ、{user.name}さん</p>
            <div className="flex gap-3 items-center">
              <Button onClick={() => router.push("/talk-room")}>
                就活AIと会話を始める！
              </Button>
              <Button onClick={() => router.push("/user-work-profile")}>
                プロフィールを作成する📝
              </Button>
              <Button onClick={() => router.push("/job-search")}>
                求人を検索する🔍
              </Button>
            </div>
          </div>
        )}
      </section>
    </BasicLayout>
  );
};
