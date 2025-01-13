"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/ui-elements/avatar";
import { Button } from "@/components/shared/ui-elements/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/shared/ui-elements/card";
import { Input } from "@/components/shared/ui-elements/input";

interface Message {
  message_id: number;
  content: string;
  sender: "user" | "ai";
}

export const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      message_id: 1,
      content:
        "こんにちは！就活のサポートを担当させていただきます。どのようなお仕事をお探しですか？",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      message_id: messages.length + 1,
      content: input,
      sender: "user",
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/images/AI就活エージェント.png" alt="AI Agent" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">AIキャリアアドバイザー</h2>
            <p className="text-sm text-muted-foreground">オンライン</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.message_id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "ai" && (
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage
                  src="/images/AI就活エージェント.png"
                  alt="AI Agent"
                />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力してください..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">送信</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
