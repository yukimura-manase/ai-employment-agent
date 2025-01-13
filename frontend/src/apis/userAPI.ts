import { serverUrl } from "@/constants/env";
import { CreateUserReq } from "@/types/user/req/CreateUserReq";
import { UserRes } from "@/types/user/res/UserRes";

export class UserApi {
  private constructor() {}

  /**
   * ユーザー登録API
   */
  static async createUser(req: CreateUserReq): Promise<UserRes> {
    const res = await fetch(`${serverUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    console.log("res", res);
    return res.json();
  }
}
