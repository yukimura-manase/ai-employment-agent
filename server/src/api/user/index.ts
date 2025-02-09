import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { env } from "hono/adapter";

// toC User Entity API Group
export const userRouter = new Hono();

// ユーザー一覧取得
userRouter.get("/", async (context) => {
  return context.text("Hello User!");
});

// 特定のユーザー取得
userRouter.get("/:userId", async (context) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(context);
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });

    const userId = context.req.param("userId");
    if (!userId) {
      return context.text("Missing parameters", 400);
    }

    const user = await prisma.user.findUnique({
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
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(context);
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });

    // リクエストボディの取り出し
    const { email } = await context.req.json<{ email: string }>();
    if (!email) {
      return context.text("Missing parameters", 400);
    }

    const user = await prisma.user.findUnique({
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
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(context);

  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });

    // リクエストボディの取り出し
    const { name, email } = await context.req.json<{
      name: string;
      email: string;
    }>();
    // console.log("name", name);
    // console.log("email", email);

    // パラメータの簡易バリデーション（必要に応じてしっかりとしたチェックを入れる）
    if (!name || !email) {
      return context.text("Missing parameters", 400);
    }

    // すでに登録済みのメールアドレスかチェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // 登録済みのユーザーがいる場合は、そのユーザー情報を返却する。
    if (existingUser) {
      return context.json({
        userId: existingUser.userId,
        name: existingUser.name,
        email: existingUser.email,
        createdAt: existingUser.createdAt,
      });
    }

    // ユーザーの新規登録
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    // 作成したユーザーを返却
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
