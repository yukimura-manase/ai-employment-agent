import { serverUrl } from "@/constants/env";
import { AiChatMessageReq } from "@/types/message/req/AiChatMessageReq";
import { AiChatMessageRes } from "@/types/message/res/AiChatMessageRes";

export class AiChatApi {
  private constructor() {}

  /**
   * AIと会話するAPI
   */
  static async sendMessage(req: AiChatMessageReq): Promise<AiChatMessageRes> {
    const res = await fetch(`${serverUrl}/ai-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return res.json();
  }
}
