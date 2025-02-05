import { serverUrl } from "@/constants/env";
import { CreateUserReq } from "@/types/user/req/CreateUserReq";
import { UserRes } from "@/types/user/res/UserRes";

export class UserWorkProfileApi {
  private constructor() {}

  // CreateUserWorkProfileReq
  static async createUserWorkProfile(req: any): Promise<UserRes> {
    const res = await fetch(`${serverUrl}/user-work-profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    // console.log("res", res);
    return res.json();
  }
}
