import { serverUrl } from "@/constants/env";
import { CreateUserReq } from "@/types/user/req/CreateUserReq";
import { UserRes } from "@/types/user/res/UserRes";

export class UserApi {
  private constructor() {}

  /**
   * 特定のユーザー取得
   *
   * - ユーザーがDBに登録されていない場合、nullを返す。
   */
  static async getUser(userId: string): Promise<UserRes | null> {
    const res = await fetch(`${serverUrl}/users/${userId}`);
    return res.json();
  }

  /**
   * ユーザーをemailで検索する。
   */
  static async getUserByEmail(email: string): Promise<UserRes | null> {
    const res = await fetch(`${serverUrl}/users/email/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.json();
  }

  /**
   * ユーザー登録API
   */
  static async createUser(req: CreateUserReq): Promise<UserRes> {
    const res = await fetch(`${serverUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    // console.log("res", res);
    return res.json();
  }
}
