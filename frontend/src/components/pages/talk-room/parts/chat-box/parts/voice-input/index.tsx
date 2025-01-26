"use client";

import { Button } from "@/components/shared/ui-elements/button";
import { Mic, MicOff, StopCircle } from "lucide-react";
import { useVoiceInput } from "./hooks/useVoiceInput";
import { useMessageStates } from "@/stores/message";
import { useUserStates } from "@/stores/user";

// WindowオブジェクトにwebkitSpeechRecognitionプロパティを追加するためのグローバルインターフェースを宣言する。
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface VoiceInputProps {
  userId: string;
}

/**
 * 音声入力コンポーネント
 */
export const VoiceInput = ({ userId }: VoiceInputProps) => {
  const { user } = useUserStates();
  const {
    messages,
    voiceInputMsg,
    setVoiceInputMsg,
    createUserMessage,
    createAIMessage,
  } = useMessageStates();
  const { isListening, toggleListening, stopConversation } = useVoiceInput({
    userId,
    voiceInputMsg,
    setVoiceInputMsg,
    createUserMessage,
    createAIMessage,
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-center space-x-4">
        <Button
          onClick={async () => await toggleListening()}
          variant={isListening ? "destructive" : "default"}
        >
          {isListening ? (
            <MicOff className="mr-2 h-4 w-4" />
          ) : (
            <Mic className="mr-2 h-4 w-4" />
          )}
          {isListening ? "停止" : "開始"}
        </Button>
        <Button onClick={stopConversation} variant="outline">
          <StopCircle className="mr-2 h-4 w-4" />
          会話中止
        </Button>
      </div>
      <div className="text-center text-sm text-muted-foreground">
        {isListening ? "音声を認識中..." : "音声認識待機中"}
      </div>
      <div className="p-4 bg-muted rounded-md min-h-[100px] break-words">
        {voiceInputMsg || "音声が認識されるとここに表示されます。"}
      </div>
    </div>
  );
};
