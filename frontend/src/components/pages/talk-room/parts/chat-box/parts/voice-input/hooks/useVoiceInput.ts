import { CreateMessageReq } from "@/types/message/req/CreateMessageReq";
import { useState, useEffect, useCallback } from "react";

interface UseVoiceInputProps {
  userId: string;
  setVoiceInputMsg: (transcript: string) => void;
  createUserMessage: (userId: string) => Promise<void>;
}

/**
 * 音声入力 Input Hook
 *
 * - 音声入力の状態を管理する。
 */
export const useVoiceInput = ({
  userId,
  setVoiceInputMsg,
  createUserMessage,
}: UseVoiceInputProps) => {
  // 音声入力中かどうか
  const [isListening, setIsListening] = useState(false);

  // @ts-ignore
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  type SpeechRecognition = typeof SpeechRecognition;

  // 音声認識インスタンス
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

      // 音声認識結果が返ってきたときの処理を作成する。
      recognitionInstance.onresult = (event: SpeechRecognition) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;

        // Store に音声認識結果を保存する。
        setVoiceInputMsg(text);
      };

      // 音声認識インスタンスをセットする。
      setRecognition(recognitionInstance);
    }
  }, []);

  /**
   * 音声認識の ON/OFF をトグル
   */
  const toggleListening = useCallback(async () => {
    if (!recognition) return;

    // 会話を終了させる際に、メッセージを保存する。
    if (isListening) {
      recognition.stop();
      setIsListening(false);

      // Messageの新規作成処理を実行する。
      await createUserMessage(userId);
    } else {
      recognition.start();
      setIsListening(true);
    }
  }, [isListening, recognition]);

  /**
   * 明示的に会話を終了させる
   */
  const stopConversation = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
    setVoiceInputMsg("");
  }, [recognition]);

  return {
    isListening,
    toggleListening,
    stopConversation,
  };
};
