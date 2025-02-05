import { Hono } from "hono";
import {
  PrismaClient,
  type UserCareerHistory,
  type UserCurrentWork,
  type UserSkill,
  type UserTargetWork,
  type UserWorkProfile,
} from "@prisma/client";
import { env } from "hono/adapter";
import type { CreateUserWorkProfileReq } from "@/types/user-work-profile/CreateUserWorkProfileReq.js";

// toC UserWorkProfile Entity API Group
export const userWorkProfileRouter = new Hono();

// UserWorkProfile の取得API: GET /user-work-profiles/:userId
userWorkProfileRouter.get("/:userId", async (context) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(context);
  // userId を取得
  const userId = context.req.param("userId");

  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });

    // 特定Userに紐づく、UserWorkProfileを取得する。
    // UserWorkProfile に紐づいている UserCareerHistory, UserSkill, UserCurrentWork, UserTargetWork も取得する。
    const userWorkProfile: UserWorkProfile | null =
      await prisma.userWorkProfile.findUnique({
        where: { userId },
        include: {
          userCareerHistories: true, // 職務経歴
          userSkills: true, // スキル
          userCurrentWork: true, // 現在の仕事内容
          userTargetWork: true, // 目指す仕事内容
        },
      });

    return context.json(userWorkProfile);
  } catch (error) {
    console.error(error);
    return context.json({ error: "Internal Server Error" }, 500);
  }
});

// UserWorkProfile 関連データの新規登録API: POST /user-work-profiles
// (UserWorkProfile, UserCareerHistory, UserSkill, UserCurrentWork, UserTargetWork の新規登録・更新)
userWorkProfileRouter.post("/", async (context) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(context);
  // 新規登録するデータを取得する。
  const {
    userId,
    lastEducation,
    userCareerHistories,
    userSkills,
    userCurrentWork,
    userTargetWork,
  } = await context.req.json<CreateUserWorkProfileReq>();

  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: DATABASE_URL,
        },
      },
    });

    // 最初に、userWorkProfile を新規登録する。
    const newUserWorkProfile: UserWorkProfile =
      await prisma.userWorkProfile.create({
        data: {
          userId,
          lastEducation,
        },
      });

    // 続いて userCareerHistories, userSkills, userCurrentWork, userTargetWork を新規登録する。
    const newUserCareerHistories = await Promise.all(
      userCareerHistories.map((history) =>
        prisma.userCareerHistory.create({
          data: {
            userId,
            userWorkProfileId: newUserWorkProfile.userWorkProfileId,
            ...history,
          },
        })
      )
    );
    const newUserSkills = await Promise.all(
      userSkills.map((skill) =>
        prisma.userSkill.create({
          data: {
            userId,
            userWorkProfileId: newUserWorkProfile.userWorkProfileId,
            ...skill,
          },
        })
      )
    );
    const newUserCurrentWork: UserCurrentWork =
      await prisma.userCurrentWork.create({
        data: {
          userId,
          userWorkProfileId: newUserWorkProfile.userWorkProfileId,
          ...userCurrentWork,
        },
      });
    const newUserTargetWork: UserTargetWork =
      await prisma.userTargetWork.create({
        data: {
          userId,
          userWorkProfileId: newUserWorkProfile.userWorkProfileId,
          ...userTargetWork,
        },
      });

    // 新規登録したデータを返す。
    return context.json({
      userWorkProfile: newUserWorkProfile,
      userCareerHistories: newUserCareerHistories,
      userSkills: newUserSkills,
      userCurrentWork: newUserCurrentWork,
      userTargetWork: newUserTargetWork,
    });
  } catch (error) {
    console.error(error);
    return context.json({ error: "Internal Server Error" }, 500);
  }
});

// UserWorkProfile 関連データの更新API: PUT /user-work-profiles
userWorkProfileRouter.put("/", async (context) => {
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(context);
});
