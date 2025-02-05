import { serverUrl } from "@/constants/env";
import { CreateUserWorkProfileReq } from "@/types/user-work-profile/req/CreateUserWorkProfileReq";
import { UpdateUserWorkProfileReq } from "@/types/user-work-profile/req/UpdateUserWorkProfileReq";
import { UserWorkProfileRes } from "@/types/user-work-profile/res/UserWorkProfileRes";
import { UserRes } from "@/types/user/res/UserRes";

export class UserWorkProfileApi {
  private constructor() {}

  /**
   * ユーザーの就活プロフィール情報を取得するAPI
   */
  static async getUserWorkProfile(userId: string): Promise<UserWorkProfileRes> {
    const res = await fetch(`${serverUrl}/user-work-profiles/${userId}`);
    return res.json();
  }

  /**
   * ユーザーの就活プロフィール情報を登録するAPI
   */
  static async createUserWorkProfile(
    req: CreateUserWorkProfileReq
  ): Promise<UserWorkProfileRes> {
    const res = await fetch(`${serverUrl}/user-work-profiles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    // console.log("res", res);
    return res.json();
  }

  /**
   * ユーザーの就活プロフィール情報を更新するAPI
   */
  static async updateUserWorkProfile(
    req: UpdateUserWorkProfileReq
  ): Promise<UserWorkProfileRes> {
    const res = await fetch(`${serverUrl}/user-work-profiles`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return res.json();
  }
}
