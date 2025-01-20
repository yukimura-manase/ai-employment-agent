import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/ui-elements/avatar";
import { Message } from "@/types/message/Message";
import { MessageRes } from "@/types/message/res/MessageRes";

interface MessageProps {
  message: MessageRes;
}

/**
 * Message UI Component
 *
 * - メッセージの送信者(AI/User)によって表示を変える。
 */
export const MessageUi = ({ message }: MessageProps) => {
  return (
    <div
      key={message.messageId}
      className={`flex ${
        message.sender === "USER" ? "justify-end" : "justify-start"
      }`}
    >
      {message.sender === "AI" && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="/images/AI就活エージェント.png" alt="AI Agent" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.sender === "USER"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};
