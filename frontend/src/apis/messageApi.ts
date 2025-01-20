import { serverUrl } from "@/constants/env";
import { CreateMessageReq } from "@/types/message/req/CreateMessageReq";
import { GetMessageListReq } from "@/types/message/req/GetMessageListReq";
import { GetMessageListRes, MessageRes } from "@/types/message/res/MessageRes";

export class MessageApi {
  private constructor() {}

  /**
   * Message 一覧取得API
   */
  static async fetchMessages(req: GetMessageListReq): Promise<MessageRes[]> {
    const res = await fetch(`${serverUrl}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    console.log("fetchMessages Res:", res);
    return res.json();
  }

  /**
   * Message 登録API
   */
  static async createMessage(req: CreateMessageReq): Promise<MessageRes> {
    const res = await fetch(`${serverUrl}/messages`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    console.log("createMessage Res:", res);
    return res.json();
  }
}
