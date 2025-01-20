import { MessageApi } from "@/apis/messageApi";
import { CreateMessageReq } from "@/types/message/req/CreateMessageReq";
import { MessageRes } from "@/types/message/res/MessageRes";
import { randomUUID } from "crypto";
import { create } from "zustand";

interface MessageStates {
  messages: MessageRes[];
  voiceInputMsg: string; // 音声入力のテキスト
}

interface MessageActions {
  setMessages: (messages: MessageRes[]) => void;
  setVoiceInputMsg: (voiceInputMsg: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
  createUserMessage: (userId: string) => Promise<void>;
}

/**
 * Message の状態を管理するための Store
 */
export const useMessageStates = create<MessageStates & MessageActions>()(
  (set) => ({
    // ------------------------- States -------------------------
    messages: [
      {
        userId: "1",
        messageId: "1",
        content:
          "こんにちは！就活のサポートを担当させていただきます。どのようなお仕事をお探しですか？",
        sender: "AI",
        createdAt: new Date().toISOString(),
      },
    ],
    voiceInputMsg: "",

    // ------------------------- Actions -------------------------
    setMessages: (messages: MessageRes[]) => set({ messages }),
    setVoiceInputMsg: (voiceInputMsg: string) => set({ voiceInputMsg }),
    /**
     * メッセージ一覧を取得する。
     */
    fetchMessages: async (userId: string) => {
      try {
        const messages: MessageRes[] = await MessageApi.fetchMessages({
          userId,
        });
        set({
          messages: [
            {
              userId: userId,
              messageId: "1",
              content:
                "こんにちは！就活のサポートを担当させていただきます。どのようなお仕事をお探しですか？",
              sender: "AI",
              createdAt: "2021-09-01T00:00:00.000Z",
            },
            ...messages,
          ],
        });
      } catch (error) {
        console.error(error);
      }
    },

    /**
     * メッセージを登録する。
     */
    createUserMessage: async (userId: string) => {
      try {
        const userMessage = useMessageStates.getState().voiceInputMsg;
        // 空文字の場合は、返却する。
        if (!userMessage) return;

        const copyMessages = useMessageStates.getState().messages;
        // Message内容を Store に保存して、UIに反映させる。
        set({
          messages: [
            ...copyMessages,
            {
              userId: "1",
              messageId: "1",
              content: userMessage,
              sender: "USER",
              createdAt: new Date().toISOString(),
            },
          ],
        });

        // 音声入力内容を登録する。
        await MessageApi.createMessage({
          userId,
          sender: "USER",
          content: userMessage,
        });

        // 音声入力内容を初期化する。
        set({ voiceInputMsg: "" });
      } catch (error) {
        console.error(error);
      }
    },
  })
);
