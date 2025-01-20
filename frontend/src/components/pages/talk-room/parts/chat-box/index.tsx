"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/shared/ui-elements/card";
import { VoiceInput } from "./parts/voice-input";
import { ChatBoxHeader } from "./parts/chat-box-header";
import { useMessageStates } from "@/stores/message";
import { MessageRes } from "@/types/message/res/MessageRes";
import { MessageUi } from "./parts/message";
import { UserRes } from "@/types/user/res/UserRes";
import { useChatBox } from "./hooks/useChatBox";

interface ChatBoxProps {
  user: UserRes;
}

export const ChatBox = ({ user }: ChatBoxProps) => {
  const { messages, fetchMessages } = useMessageStates();
  const {} = useChatBox({ userId: user.userId, fetchMessages });

  return (
    <Card className="w-full h-[700px] flex flex-col">
      <CardHeader className="border-b p-4">
        <ChatBoxHeader />
      </CardHeader>

      {/* チャットメッセージ */}
      <CardContent className="overflow-y-auto p-4 space-y-4">
        {messages &&
          messages.length > 0 &&
          messages.map((message: MessageRes) => (
            <MessageUi message={message} key={message.messageId} />
          ))}
      </CardContent>

      {/* 音声入力 */}
      <CardFooter className="border-t p-4 flex flex-col space-y-4">
        <VoiceInput userId={user.userId} />
      </CardFooter>
    </Card>
  );
};
