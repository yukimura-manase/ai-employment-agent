/**
 * FE-BE で取り扱うメッセージの型
 */
export interface Message {
  messageId: string;
  userId: string;
  sender: "USER" | "AI";
  content: string;
  createdAt: string;
}
