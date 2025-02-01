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
import { Skeleton } from "@/components/shared/ui-elements/skeleton";

interface ChatBoxProps {
  user: UserRes;
}

export const ChatBox = ({ user }: ChatBoxProps) => {
  const { messages, fetchMessages, isAiThinking } = useMessageStates();
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

        {/* AIが思考中の場合は、最後尾にローディング・アイコンを表示する */}
        {isAiThinking && (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        )}
      </CardContent>

      {/* 音声入力 */}
      <CardFooter className="border-t p-4 flex flex-col space-y-4">
        <VoiceInput userId={user.userId} isAiThinking={isAiThinking} />
      </CardFooter>
    </Card>
  );
};
