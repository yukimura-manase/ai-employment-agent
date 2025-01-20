/**
 * Message の新規作成時のリクエスト
 */
export interface CreateMessageReq {
  userId: string;
  sender: "USER" | "AI";
  content: string;
}
