import { Hono } from "hono";
import type {
  UserCareerHistory,
  UserCurrentWork,
  UserSkill,
  UserTargetWork,
  UserWorkProfile,
} from "@prisma/client";
import type { CreateUserWorkProfileReq } from "@/types/user-work-profile/CreateUserWorkProfileReq.js";
import { globalPrisma } from "@/libs/dbClient.js";

// toC UserWorkProfile Entity API Group
export const userWorkProfileRouter = new Hono();

// UserWorkProfile の取得API: GET /user-work-profiles/:userId
userWorkProfileRouter.get("/:userId", async (context) => {
  // userId を取得
  const userId = context.req.param("userId");

  try {
    // 特定Userに紐づく、UserWorkProfileを取得する。
    // UserWorkProfile に紐づいている UserCareerHistory, UserSkill, UserCurrentWork, UserTargetWork も取得する。
    const userWorkProfile: UserWorkProfile | null =
      await globalPrisma.userWorkProfile.findUnique({
        where: { userId },
        include: {
          userCurrentWork: true, // 現在の仕事内容
          userTargetWork: true, // 目指す仕事内容
          // userSkills: {
          //   orderBy: { createdAt: "asc" }, // スキルを作成日時の昇順で取得する。
          // }, // スキル
          // TODO: 任意項目のデータは、後で追加する。
          // userCareerHistories: true, // 職務経歴
        },
      });

    return context.json(userWorkProfile);
  } catch (error) {
    console.error(error);
    return context.json({ error: "Internal Server Error" }, 500);
  }
});

// TODO: 新規登録 / 更新のエンドポイントを分離する。(工数の都合上、一旦まとめて実装する。)
// UserWorkProfile 関連データの新規登録API: POST /user-work-profiles
// (UserWorkProfile, UserCareerHistory, UserSkill, UserCurrentWork, UserTargetWork の新規登録・更新)
userWorkProfileRouter.post("/", async (context) => {
  // 登録するデータを取得する。
  const {
    userId,
    userWorkProfileId, // NOTE: これが設定されていれば、更新扱いとなる。
    userCurrentWork,
    userTargetWork,
  } = await context.req.json<CreateUserWorkProfileReq>();

  try {
    // 既存データが存在しない場合は、新規登録する。
    if (!userWorkProfileId) {
      const newUserWorkProfile = await globalPrisma.userWorkProfile.create({
        data: {
          userId,
        },
      });

      // 続いて、必須項目を新規登録する。
      // 現在の職業, 目標の職業
      const newUserCurrentWork: UserCurrentWork =
        await globalPrisma.userCurrentWork.create({
          data: {
            userId,
            userWorkProfileId: newUserWorkProfile.userWorkProfileId,
            ...userCurrentWork,
          },
        });
      const newUserTargetWork: UserTargetWork =
        await globalPrisma.userTargetWork.create({
          data: {
            userId,
            userWorkProfileId: newUserWorkProfile.userWorkProfileId,
            ...userTargetWork,
          },
        });

      // 新規登録したデータを返す。
      return context.json({
        userWorkProfile: newUserWorkProfile,
        userCurrentWork: newUserCurrentWork,
        userTargetWork: newUserTargetWork,
      });
    }

    // 必須項目を取得する。
    // 現在の職業, 目標の職業
    const existingUserCurrentWork =
      await globalPrisma.userCurrentWork.findUnique({
        where: { userId, userWorkProfileId },
      });
    const existingUserTargetWork = await globalPrisma.userTargetWork.findUnique(
      {
        where: { userId, userWorkProfileId },
      }
    );

    // 更新するデータが存在しない場合は、エラーを返す。
    if (!existingUserCurrentWork || !existingUserTargetWork) {
      return context.json(
        { error: "UserCurrentWork or UserTargetWork not found" },
        404
      );
    }

    // 必須項目を更新する。
    const updatedUserCurrentWork = await globalPrisma.userCurrentWork.update({
      where: { userId },
      data: {
        ...existingUserCurrentWork,
        ...userCurrentWork, // 更新するデータ
      },
    });
    const updatedUserTargetWork = await globalPrisma.userTargetWork.update({
      where: { userTargetWorkId: existingUserTargetWork.userTargetWorkId },
      data: {
        ...existingUserTargetWork,
        ...userTargetWork, // 更新するデータ
      },
    });

    // スキルを取得する。
    // const existingUserSkills = await prisma.userSkill.findMany({
    //   where: { userId, userWorkProfileId },
    //   orderBy: { createdAt: "asc" },
    // });

    // スキルを1つ1つ更新する。
    // const updatedUserSkills = await Promise.all(
    //   existingUserSkills.map((skill) =>
    //     prisma.userSkill.update({
    //       where: { userSkillId: skill.userSkillId },
    //       data: {
    //         ...skill,
    //         ...userSkills, // 更新するデータ
    //       },
    //     })
    //   )
    // );

    // 更新したデータを返す。
    return context.json({
      userCurrentWork: updatedUserCurrentWork,
      userTargetWork: updatedUserTargetWork,
    });
  } catch (error) {
    console.error(error);
    return context.json({ error: "Internal Server Error" }, 500);
  }
});

// UserWorkProfile 関連データの更新API: PUT /user-work-profiles
// userWorkProfileRouter.put("/", async (context) => {
//   const { DATABASE_URL } = env<{ DATABASE_URL: string }>(context);

//   // 更新するデータを取得する。
//   const {
//     userWorkProfileId,
//     userId,
//     userSkills,
//     userCurrentWork,
//     userTargetWork,
//     // TODO: 任意項目のデータは、後で追加する。
//     // lastEducation,
//     // userCareerHistories,
//   } = await context.req.json<UpdateUserWorkProfileReq>();

//   try {
//     const prisma = new PrismaClient({
//       datasources: {
//         db: {
//           url: DATABASE_URL,
//         },
//       },
//     });

//     // 最初に userWorkProfile を更新する。
//     const updatedUserWorkProfile: UserWorkProfile =
//       await prisma.userWorkProfile.update({
//         where: { userWorkProfileId },
//         data: {
//           lastEducation,
//         },
//       });

//     // 続いて userCareerHistories, userSkills, userCurrentWork, userTargetWork
//     // などのデータが送られてきている場合は更新する。
//     let updatedUserCareerHistories: UserCareerHistory[] = [];
//     if (userCareerHistories) {
//       updatedUserCareerHistories = await Promise.all(
//         userCareerHistories.map((history) =>
//           prisma.userCareerHistory.update({
//             where: { userCareerHistoryId: history.userCareerHistoryId },
//             data: history,
//           })
//         )
//       );
//     }

//     let updatedUserSkills: UserSkill[] = [];
//     if (userSkills) {
//       updatedUserSkills = await Promise.all(
//         userSkills.map((skill) =>
//           prisma.userSkill.update({
//             where: { userSkillId: skill.userSkillId },
//             data: skill,
//           })
//         )
//       );
//     }

//     let updatedUserCurrentWork: UserCurrentWork | null = null;
//     if (userCurrentWork) {
//       updatedUserCurrentWork = await prisma.userCurrentWork.update({
//         where: { userCurrentWorkId: userCurrentWork.userCurrentWorkId },
//         data: userCurrentWork,
//       });
//     }

//     let updatedUserTargetWork: UserTargetWork | null = null;
//     if (userTargetWork) {
//       updatedUserTargetWork = await prisma.userTargetWork.update({
//         where: { userTargetWorkId: userTargetWork.userTargetWorkId },
//         data: userTargetWork,
//       });
//     }

//     // 更新したデータを返す。
//     return context.json({
//       userWorkProfile: updatedUserWorkProfile,
//       userCareerHistories: updatedUserCareerHistories,
//       userSkills: updatedUserSkills,
//       userCurrentWork: updatedUserCurrentWork,
//       userTargetWork: updatedUserTargetWork,
//     });
//   } catch (error) {
//     console.error(error);
//     return context.json({ error: "Internal Server Error" }, 500);
//   }
// });
