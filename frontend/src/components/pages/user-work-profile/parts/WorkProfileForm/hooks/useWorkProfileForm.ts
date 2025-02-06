import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserWorkProfileApi } from "@/apis/userWorkProfileApi";
import { toast } from "@/hooks/use-toast";
import { WorkStyle } from "@/types/user-work-profile/UserWorkProfile";
import { UserWorkProfileRes } from "@/types/user-work-profile/res/UserWorkProfileRes";

/**
 * ユーザーの職務経歴を管理するためのフォームのスキーマ
 */
export const formSchema = z.object({
  /** 現在の職務 */
  currentWork: z.object({
    currentIndustry: z.string().min(1, "必須入力です。"), // 必須
    currentJobType: z.string().min(1, "必須入力です。"), // 必須
    currentSalary: z.number().min(0, "必須入力です。"), // 必須 0以上
    currentCompany: z.string().min(1, "必須入力です。"), // 必須
    currentRole: z.string().min(1, "必須入力です。"), // 必須
    currentWorkStyle: z.enum([
      "REMOTE",
      "HYBRID",
      "ONSITE",
      "FREELANCE",
    ]) as z.ZodType<WorkStyle>, // 必須
  }),
  /** 目指している職務 */
  targetWork: z.object({
    targetIndustry: z.string().min(1, "必須入力です。"), // 必須
    targetJobType: z.string().min(1, "必須入力です。"), // 必須
    targetJobContent: z.string().min(1, "必須入力です。"), // 必須
    targetSalary: z.number().min(0, "必須入力です。"), // 必須
    targetWorkStyle: z.enum([
      "REMOTE",
      "HYBRID",
      "ONSITE",
      "FREELANCE",
    ]) as z.ZodType<WorkStyle>, // 必須

    // 任意項目
    targetCompany: z.string().optional(),
    targetRole: z.string().optional(),
    targetOtherConditions: z.string().optional(),
  }),

  /** スキル */
  // skills: z
  //   .array(z.string().min(1, "最低1つは入力してください。"))
  //   .length(1, "最低1つは入力してください。"), // 必須

  // TODO: 任意項目のデータは、後で追加する。
  /** 職務経歴 */
  // careerHistory: z.array(
  //   z.object({
  //     company: z.string().optional(),
  //     role: z.string().optional(),
  //     startDate: z.string().optional(),
  //     endDate: z.string().optional(),
  //     description: z.string().optional(),
  //   })
  // ),

  // /** 最終学歴 */
  // lastEducation: z.string().optional(),
});

interface UseWorkProfileFormProps {
  userId: string;
  workProfile: UserWorkProfileRes | null;
}

/**
 * ユーザーの就活プロフィール情報を管理するためのフォームのフック
 * @param userId ユーザーID
 * @returns フォームのインスタンス、送信関数、送信中フラグ、送信中フラグのセッター
 */
export const useWorkProfileForm = ({
  userId,
  workProfile,
}: UseWorkProfileFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * フォームのデータを作成する関数
   * @param workProfile ユーザーの就活プロフィール情報
   * @returns フォームのデータ
   */
  const createFormData = (workProfile: UserWorkProfileRes | null) => {
    return {
      currentWork: {
        currentIndustry: workProfile?.userCurrentWork.currentIndustry ?? "", // 必須入力
        currentJobType: workProfile?.userCurrentWork.currentJobType ?? "", // 必須入力
        currentSalary: workProfile?.userCurrentWork.currentSalary ?? 0, // 必須入力
        currentCompany: workProfile?.userCurrentWork.currentCompany ?? "", // 必須入力
        currentRole: workProfile?.userCurrentWork.currentRole ?? "", // 必須入力
        currentWorkStyle:
          workProfile?.userCurrentWork.currentWorkStyle ??
          ("REMOTE" as WorkStyle), // 必須入力
      },
      targetWork: {
        targetIndustry: workProfile?.userTargetWork.targetIndustry ?? "", // 必須入力
        targetJobType: workProfile?.userTargetWork.targetJobType ?? "", // 必須入力
        targetJobContent: workProfile?.userTargetWork.targetJobContent ?? "", // 必須入力
        targetSalary: workProfile?.userTargetWork.targetSalary ?? 0, // 必須入力
        targetWorkStyle:
          workProfile?.userTargetWork.targetWorkStyle ??
          ("REMOTE" as WorkStyle), // 必須入力
        targetCompany: workProfile?.userTargetWork.targetCompany ?? "",
        targetRole: workProfile?.userTargetWork.targetRole ?? "",
        targetOtherConditions:
          workProfile?.userTargetWork.targetOtherConditions ?? "",
      },
    };
  };

  /**
   * react-hook-formのフォームのインスタンス
   */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: createFormData(workProfile),
  });

  // DEBUG専用: フォームのデータをコンソールに出力
  // console.log("form", form.getValues());

  /**
   * ユーザーの職務経歴を送信する関数
   * @param formData フォームのデータ
   * @returns 送信結果
   *
   * TODO: フォーム周り改善
   */
  const submitWorkProfile = async (
    formData: FormData
  ): Promise<UserWorkProfileRes> => {
    const userWorkProfileRes: UserWorkProfileRes =
      await UserWorkProfileApi.createUserWorkProfile({
        userId,

        // 必須項目
        userCurrentWork: {
          ...form.getValues("currentWork"),
          currentSalary: form.getValues("currentWork.currentSalary") ?? 0,
          currentRole: form.getValues("currentWork.currentRole") ?? "",
        },
        userTargetWork: {
          ...form.getValues("targetWork"),
          targetCompany: form.getValues("targetWork.targetCompany") ?? "",
          targetRole: form.getValues("targetWork.targetRole") ?? "",
          targetOtherConditions:
            form.getValues("targetWork.targetOtherConditions") ?? "",
        },

        // TODO: 任意項目のデータは、後で追加する。
        // userSkills: form.getValues("skills").map((skillName) => ({ skillName })),
        // userCareerHistories: form
        // .getValues("careerHistory")
        // .map((careerHistory) => ({
        //   company: careerHistory.company ?? "",
        //   role: careerHistory.role ?? "",
        //   startDate: careerHistory.startDate ?? "",
        //   endDate: careerHistory.endDate ?? "",
        //   description: careerHistory.description ?? "",
        // })),
        // lastEducation: form.getValues("lastEducation") ?? "",
      });
    return userWorkProfileRes;
  };

  /**
   * フォームの送信
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const result: UserWorkProfileRes = await submitWorkProfile(formData);
      console.log("result", result);

      // 送信成功 Toast
      toast({
        title: "Success",
        description: "保存が完了しました🐱",
      });
    } catch (error) {
      // 送信失敗 Toast
      toast({
        title: "Error",
        description: "保存に失敗しました🥺",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ユーザーの就活プロフィール情報が更新されたら、フォームのデータを更新する。
  useEffect(() => {
    if (workProfile) {
      form.reset(createFormData(workProfile));
    }
  }, [workProfile]);

  return { form, onSubmit, isSubmitting, setIsSubmitting };
};
