import { Hono } from "hono";
import { globalPrisma } from "@/libs/dbClient.js";

// toC User Entity API Group
export const userRouter = new Hono();

// ユーザー一覧取得
userRouter.get("/", async (context) => {
  return context.text("Hello User!");
});

// 特定のユーザー取得
userRouter.get("/:userId", async (context) => {
  try {
    const userId = context.req.param("userId");
    if (!userId) {
      return context.text("Missing parameters", 400);
    }

    const user = await globalPrisma.user.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!user) {
      // ユーザーが見つからない場合は、nullを返却する。
      return context.json(null);
    }

    return context.json(user);
  } catch (error) {
    console.error(error);
    return context.text("Internal Server Error", 500);
  }
});

// 特定のユーザーをemailで検索する。
userRouter.post("/email/", async (context) => {
  try {
    const { email } = await context.req.json<{ email: string }>();
    if (!email) {
      return context.text("Missing parameters", 400);
    }

    const user = await globalPrisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // ユーザーが見つからない場合は、nullを返却する。
      return context.json(null);
    }

    return context.json(user);
  } catch (error) {
    console.error(error);
    return context.text("Internal Server Error", 500);
  }
});

// ユーザーの新規登録, POST /users
userRouter.post("/", async (context) => {
  try {
    const { name, email } = await context.req.json<{
      name: string;
      email: string;
    }>();

    if (!name || !email) {
      return context.text("Missing parameters", 400);
    }

    // 既存ユーザーを取得する。
    const existingUser = await globalPrisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return context.json({
        userId: existingUser.userId,
        name: existingUser.name,
        email: existingUser.email,
        createdAt: existingUser.createdAt,
      });
    }

    const newUser = await globalPrisma.user.create({
      data: {
        name,
        email,
      },
    });

    return context.json(
      {
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
      201
    );
  } catch (error) {
    console.error(error);
    return context.text("Internal Server Error", 500);
  }
});
