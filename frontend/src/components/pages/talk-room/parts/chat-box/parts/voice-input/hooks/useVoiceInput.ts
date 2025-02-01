import { CreateMessageReq } from "@/types/message/req/CreateMessageReq";
import { useState, useEffect, useCallback } from "react";
import { VoiceVoxApi } from "@/apis/voiceVoxApi";
import { AiChatApi } from "@/apis/aiChatApi";
import { AiChatMessageRes } from "@/types/message/res/AiChatMessageRes";

interface UseVoiceInputProps {
  userId: string;
  voiceInputMsg: string;
  setVoiceInputMsg: (transcript: string) => void;
  createUserMessage: (userId: string) => Promise<void>;
  setAiThinking: (isAiThinking: boolean) => void;
  fetchMessages: (userId: string) => Promise<void>;
}

/**
 * 音声入力 Input Hook
 *
 * - 音声入力の状態を管理する。
 */
export const useVoiceInput = ({
  userId,
  voiceInputMsg,
  setVoiceInputMsg,
  createUserMessage,
  setAiThinking,
  fetchMessages,
}: UseVoiceInputProps) => {
  // 音声認識の状態
  const [isListening, setIsListening] = useState(false);

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
   * AIの応答を音声で再生する
   */
  const playAIResponse = async (text: string) => {
    try {
      // 音声を合成して、Blob を取得する。
      const audioBlob = await VoiceVoxApi.synthesizeSpeech(text);
      // Blob を URL に変換する。
      const audioUrl = URL.createObjectURL(audioBlob);
      // 音声インスタンス & 再生する。
      const audio = new Audio(audioUrl);
      await audio.play();

      // 再生が終わったらURLを解放
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error("Error playing AI response:", error);
    }
  };

  /**
   * 音声認識の ON/OFF をトグル
   */
  const toggleListening = useCallback(async () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);

      try {
        // AIメッセージを受信してから、ユーザーメッセージを保存する。
        // ai-chat エンドポイント内で、会話履歴を取得しているため、先に保存すると、今の質問に対する判断が正しくできなくなる。
        await createUserMessage(userId);

        setAiThinking(true); // AIを思考中にする。
        // AIにメッセージを送信する。
        const aiMessage: AiChatMessageRes = await AiChatApi.sendMessage({
          userId: userId,
          userQuery: voiceInputMsg,
        });
        setAiThinking(false); // AIの思考を完了にする。

        // 会話履歴を、再度取得する。
        await fetchMessages(userId);

        // AIメッセージを再生する。
        await playAIResponse(aiMessage.aiMessage);
      } catch (error) {
        console.error("Error in toggleListening:", error);
      }
    } else {
      recognition.start();
      setIsListening(true);
    }
  }, [isListening, recognition, voiceInputMsg, userId]);

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
