import { Button } from "@/components/shared/ui-elements/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shared/ui-elements/form";
import { Input } from "@/components/shared/ui-elements/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/ui-elements/select";
import { Textarea } from "@/components/shared/ui-elements/textarea";

import { useWorkProfileForm } from "./hooks/useWorkProfileForm";
import { CircleFadingPlusIcon, CirclePlusIcon, PlusIcon } from "lucide-react";
import { useUserStates } from "@/stores/user";
import { useRouter } from "next/router";

/**
 * ユーザーの職務経歴を入力するフォーム
 */
export function WorkProfileForm() {
  const { user } = useUserStates();
  const router = useRouter();

  // ログインしていない場合は、Topページにリダイレクトする。
  if (!user) {
    router.push("/");
    return;
  }

  const { form, onSubmit, isSubmitting } = useWorkProfileForm({
    userId: user.userId,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 現在の仕事内容 Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">現在の仕事内容</h2>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="currentWork.currentIndustry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>現在の業種・業界</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentWork.currentJobType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>現在の職業・職種</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentWork.currentSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>現在の給与 (万円単位)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseInt(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentWork.currentCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>現在の会社</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentWork.currentRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>現在の役職・役割 (任意)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentWork.currentWorkStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>現在の働き方・勤務形態</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="REMOTE">リモート勤務</SelectItem>
                      <SelectItem value="HYBRID">ハイブリッド勤務</SelectItem>
                      <SelectItem value="ONSITE">オフィス勤務</SelectItem>
                      <SelectItem value="FREELANCE">フリーランス</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* 希望する仕事内容 Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">希望する仕事内容</h2>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="targetWork.targetIndustry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>目指す業種・業界</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetWork.targetJobType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>目指す職業・職種</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetWork.targetJobContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>目指す業務内容</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetWork.targetSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>目指す給与 (万円単位)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseInt(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetWork.targetWorkStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>目指す働き方・勤務形態</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select work style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="REMOTE">リモート勤務</SelectItem>
                      <SelectItem value="HYBRID">ハイブリッド勤務</SelectItem>
                      <SelectItem value="ONSITE">オフィス勤務</SelectItem>
                      <SelectItem value="FREELANCE">フリーランス</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetWork.targetCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>目指す会社 (任意)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetWork.targetRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>目指す役職・役割 (任意)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetWork.targetOtherConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>その他の希望条件 (任意)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* スキル Section */}
        {/* <section className="space-y-4">
          <h2 className="text-xl font-bold">スキル</h2>
          {form.watch("skills").map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`skills.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>スキル {index + 1}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              form.setValue("skills", [...form.watch("skills"), ""])
            }
          >
            <CirclePlusIcon className="w-4 h-4" />
            スキルを追加する
          </Button>
        </section> */}

        {/* 職務経歴 Section */}
        {/* <section className="space-y-4"> */}
        {/* <h2 className="text-xl font-bold">職務経歴 (任意)</h2> */}
        {/* {form.watch("careerHistory").map((_, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-bold">会社 {index + 1}</h3>
              <FormField
                control={form.control}
                name={`careerHistory.${index}.company`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>会社名</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`careerHistory.${index}.role`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>役職</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`careerHistory.${index}.startDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>開始日</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`careerHistory.${index}.endDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>終了日</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`careerHistory.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>業務内容</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))} */}

        {/* 職務経歴を追加するボタン */}
        {/* <Button
            type="button"
            variant="outline"
            onClick={() =>
              form.setValue("careerHistory", [
                ...form.watch("careerHistory"),
                {
                  company: "",
                  role: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                },
              ])
            }
          >
            <CirclePlusIcon className="w-4 h-4" />
            職務経歴を追加する
          </Button> */}
        {/* </section> */}

        {/* 学歴 Section */}
        {/* <section className="space-y-4">
          <h2 className="text-xl font-bold">学歴 (任意)</h2>
          <FormField
            control={form.control}
            name="lastEducation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>最終学歴</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section> */}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "送信中..." : "プロフィールを更新する"}
        </Button>
      </form>
    </Form>
  );
}
