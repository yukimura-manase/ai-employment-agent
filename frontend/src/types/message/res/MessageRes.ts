export interface MessageRes {
  messageId: string;
  userId: string;
  sender: "USER" | "AI";
  content: string;
  createdAt: string;
}

export interface GetMessageListRes {
  messages: MessageRes[];
}
