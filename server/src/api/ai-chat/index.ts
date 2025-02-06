import { Hono } from "hono";
import { env } from "hono/adapter";
import {
  PrismaClient,
  type Message,
  type UserWorkProfile,
} from "@prisma/client";
import { aiCareerAgent } from "@/logic/aiCareerAgent.js";
import type { UserWorkProfileRes } from "@/types/user-work-profile/UserWorkProfileRes.js";

export const aiChatRouter = new Hono();

// ai-chatとの会話エンドポイント: POST /ai-chat
aiChatRouter.post("/", async (context) => {
  const { DATABASE_URL, GEMINI_API_KEY } = env<{
    DATABASE_URL: string;
    GEMINI_API_KEY: string;
  }>(context);
  // Req.userId を取得
  const { userId, userQuery } = await context.req.json<{
    userId: string;
    userQuery: string;
  }>();

  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });

    // 特定Userに紐づく、Messageをすべて取得する。
    const historyMessages: Message[] = await prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" }, // 作成日時の順番で取得する。
    });

    /**
     * 特定Userに紐づく、UserWorkProfileを取得する。
     *
     * - UserWorkProfile に紐づいている UserCurrentWork, UserTargetWork も取得する。
     */
    const userWorkProfile = (await prisma.userWorkProfile.findUnique({
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
    await prisma.message.create({
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
