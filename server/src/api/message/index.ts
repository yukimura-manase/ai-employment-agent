import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { env } from "hono/adapter";

export const messageRouter = new Hono();

// Message 履歴の取得: POST /messages
messageRouter.post("/", async (context) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(context);
  // Req.userId を取得
  const { userId } = await context.req.json<{
    userId: string;
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
    const messages = await prisma.message.findMany({
      where: { userId },
    });

    return context.json(messages);
  } catch (error) {
    console.error(error);
    return context.json({ error: "Internal Server Error" }, 500);
  }
});

// Messageの新規登録: PUT /messages
messageRouter.put("/", async (context) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(context);
  // Req.userId と Req.message を取得
  const { userId, sender, content } = await context.req.json<{
    userId: string;
    sender: "USER" | "AI";
    content: string;
  }>();

  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });

    // 新規Messageを登録する。
    const newMessage = await prisma.message.create({
      data: {
        userId,
        sender,
        content,
      },
    });

    return context.json(newMessage);
  } catch (error) {
    console.error(error);
    return context.json({ error: "Internal Server Error" }, 500);
  }
});
