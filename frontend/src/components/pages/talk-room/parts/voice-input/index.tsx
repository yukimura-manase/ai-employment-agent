"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/shared/ui-elements/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shared/ui-elements/card";
import { Mic, MicOff, StopCircle } from "lucide-react";

// WindowオブジェクトにwebkitSpeechRecognitionプロパティを追加するためのグローバルインターフェースを宣言
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export const VoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    if (
      (typeof window !== "undefined" && "SpeechRecognition" in window) ||
      "webkitSpeechRecognition" in window
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "ja-JP";

      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
    setIsListening(!isListening);
  }, [isListening, recognition]);

  const stopConversation = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      setTranscript("");
    }
  }, [recognition]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>音声入力UI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center space-x-4">
          <Button
            onClick={toggleListening}
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
          {transcript || "音声が認識されるとここに表示されます。"}
        </div>
      </CardContent>
    </Card>
  );
};
