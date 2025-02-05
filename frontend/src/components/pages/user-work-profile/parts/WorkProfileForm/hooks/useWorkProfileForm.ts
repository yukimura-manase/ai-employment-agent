import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserWorkProfileApi } from "@/apis/userWorkProfileApi";
import { toast } from "@/hooks/use-toast";

/**
 * ユーザーの職務経歴を管理するためのフォームのスキーマ
 */
export const formSchema = z.object({
  /** 最終学歴 */
  lastEducation: z.string().min(1, "Last education is required"), // 必須
  /** 職務経歴 */
  careerHistory: z.array(
    z.object({
      company: z.string().min(1, "Company is required"), // 必須
      role: z.string().min(1, "Role is required"), // 必須
      startDate: z.string().min(1, "Start date is required"), // 必須
      endDate: z.string().optional(),
      description: z.string().optional(),
    })
  ),
  /** スキル */
  skills: z.array(z.string()).min(1, "At least one skill is required"), // 必須
  /** 現在の職務 */
  currentWork: z.object({
    currentIndustry: z.string().min(1, "Current industry is required"), // 必須
    currentJobType: z.string().min(1, "Current job type is required"), // 必須
    currentSalary: z.number().min(0, "Salary must be a positive number"), // 必須
    currentCompany: z.string().min(1, "Current company is required"), // 必須
    currentRole: z.string().min(1, "Current role is required"), // 必須
    currentWorkStyle: z.enum(["REMOTE", "HYBRID", "ONSITE", "FREELANCE"]), // 必須
  }),
  /** 目標職務 */
  targetWork: z.object({
    targetIndustry: z.string().min(1, "Target industry is required"), // 必須
    targetJobType: z.string().min(1, "Target job type is required"), // 必須
    targetJobContent: z.string().min(1, "Target job content is required"), // 必須
    targetSalary: z.number().min(0, "Target salary must be a positive number"), // 必須
    targetWorkStyle: z.enum(["REMOTE", "HYBRID", "ONSITE", "FREELANCE"]), // 必須
    targetCompany: z.string().min(1, "Target company is required"), // 必須
    targetRole: z.string().min(1, "Target role is required"), // 必須
    targetOtherConditions: z.string().optional(),
  }),
});

export const useWorkProfileForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * react-hook-formのフォームのインスタンス
   */
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastEducation: "", // 必須入力
      careerHistory: [
        {
          company: "", // 必須入力
          role: "", // 必須入力
          startDate: "", // 必須入力
          endDate: "",
          description: "",
        },
      ],
      skills: [""],
      currentWork: {
        currentIndustry: "", // 必須入力
        currentJobType: "", // 必須入力
        currentSalary: 0, // 必須入力
        currentCompany: "", // 必須入力
        currentRole: "", // 必須入力
        currentWorkStyle: "REMOTE", // 必須入力
      },
      targetWork: {
        targetIndustry: "", // 必須入力
        targetJobType: "", // 必須入力
        targetJobContent: "", // 必須入力
        targetSalary: 0, // 必須入力
        targetWorkStyle: "REMOTE", // 必須入力
        targetCompany: "", // 必須入力
        targetRole: "", // 必須入力
        targetOtherConditions: "",
      },
    },
  });

  const submitWorkProfile = async (formData: FormData) => {
    const result = await UserWorkProfileApi.createUserWorkProfile(formData);
    return result;
  };

  /**
   * フォームの送信
   * @param values
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });
      const result: any = await submitWorkProfile(formData);
      toast({
        title: "Success",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit work profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, onSubmit, isSubmitting, setIsSubmitting };
};
