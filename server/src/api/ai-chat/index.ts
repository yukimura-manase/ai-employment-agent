import { Hono } from "hono";
import { env } from "hono/adapter";
import type { Message, UserWorkProfile } from "@prisma/client";
import { aiCareerAgent } from "@/logic/aiCareerAgent.js";
import type { UserWorkProfileRes } from "@/types/user-work-profile/UserWorkProfileRes.js";
import { globalPrisma } from "@/libs/dbClient.js";

export const aiChatRouter = new Hono();

// ai-chatとの会話エンドポイント: POST /ai-chat
aiChatRouter.post("/", async (context) => {
  const { GEMINI_API_KEY } = env<{
    GEMINI_API_KEY: string;
  }>(context);

  const { userId, userQuery } = await context.req.json<{
    userId: string;
    userQuery: string;
  }>();

  try {
    // 特定Userに紐づく、Messageをすべて取得する。
    const historyMessages: Message[] = await globalPrisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    const userWorkProfile = (await globalPrisma.userWorkProfile.findUnique({
      where: { userId },
      include: {
        userCurrentWork: true,
        userTargetWork: true,
      },
    })) as UserWorkProfileRes | null;

    // 会話履歴から、AIの回答を取得する。
    const aiAnswer: string = await aiCareerAgent(
      GEMINI_API_KEY,
      historyMessages,
      userQuery,
      userWorkProfile
    );

    // 回答をDBに保存する。
    await globalPrisma.message.create({
      data: {
        userId,
        content: aiAnswer,
        sender: "AI",
      },
    });

    return context.json({ aiAnswer });
  } catch (error) {
    console.error(error);
    return context.json({ error: "Internal Server Error" }, 500);
  }
});
