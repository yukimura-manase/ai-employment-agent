import { Hono } from "hono";
import type { Message } from "@prisma/client";
import { globalPrisma } from "@/libs/dbClient.js";

export const messageRouter = new Hono();

// Message 履歴の取得: POST /messages
messageRouter.post("/", async (context) => {
  const { userId } = await context.req.json<{
    userId: string;
  }>();

  try {
    const messages: Message[] = await globalPrisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return context.json(messages);
  } catch (error) {
    console.error(error);
    return context.json({ error: "Internal Server Error" }, 500);
  }
});

// Messageの新規登録: PUT /messages
messageRouter.put("/", async (context) => {
  const { userId, sender, content } = await context.req.json<{
    userId: string;
    sender: "USER" | "AI";
    content: string;
  }>();

  try {
    const newMessage: Message = await globalPrisma.message.create({
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

// Messageの削除: DELETE /messages
messageRouter.delete("/", async (context) => {
  const { userId } = await context.req.json<{
    userId: string;
  }>();

  try {
    const deletedMessage = await globalPrisma.message.deleteMany({
      where: { userId },
    });

    return context.json(deletedMessage);
  } catch (error) {
    console.error(error);
    return context.json({ error: "Internal Server Error" }, 500);
  }
});
