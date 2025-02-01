import { CreateMessageReq } from "@/types/message/req/CreateMessageReq";
import { useState, useEffect, useCallback } from "react";
import { AiChatApi } from "@/apis/aiChatApi";
import { VoiceVoxApi } from "@/apis/voiceVoxApi";

interface UseVoiceInputProps {
  userId: string;
  voiceInputMsg: string;
  setVoiceInputMsg: (transcript: string) => void;
  createUserMessage: (userId: string) => Promise<void>;
  createAIMessage: (userId: string, message: string) => Promise<void>;
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
  createAIMessage,
}: UseVoiceInputProps) => {
  // 音声認識の状態
  const [isListening, setIsListening] = useState(false);
  // WebSocket接続の状態
  const [isWSConnected, setIsWSConnected] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  type SpeechRecognition = typeof SpeechRecognition;

  // 音声認識インスタンス
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  // WebSocket接続の初期化
  // userId, isWSConnected の変更を監視して、WebSocket接続を初期化する。
  useEffect(() => {
    // サブスクリプションの状態
    let isSubscribed = true;

    /**
     * WebSocket接続の初期化
     */
    const initializeWebSocket = async () => {
      try {
        if (!isWSConnected) {
          console.log("WebSocket connecting...");
          await AiChatApi.connect(
            async (response) => {
              console.log("Received response:", response);

              // テキスト応答を処理
              if (response.type === "text") {
                await createAIMessage(userId, response.content);
              }

              // 音声応答を処理（テキスト応答の後に再生）
              if (response.type === "speech") {
                try {
                  const audio = new Audio(
                    `data:audio/wav;base64,${response.content}`
                  );
                  await audio.play();
                  console.log("Speech playback completed");
                } catch (error) {
                  console.error("Error playing speech:", error);
                }
              }
            },
            (error) => {
              console.error("WebSocket error:", error);
              if (isSubscribed) {
                setIsWSConnected(false);
              }
            }
          );
          if (isSubscribed) {
            setIsWSConnected(true);
          }
        }
      } catch (error) {
        console.error("Failed initializeWebSocket:", error);
        if (isSubscribed) {
          setIsWSConnected(false);
        }
      }
    };

    initializeWebSocket();

    return () => {
      isSubscribed = false;
      AiChatApi.disconnect();
    };
  }, [userId, isWSConnected]);

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
      const audioBlob = await VoiceVoxApi.synthesizeSpeech(text);
      const audioUrl = URL.createObjectURL(audioBlob);
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
        // WebSocketが接続されていない場合は再接続を試みる
        if (!isWSConnected) {
          await AiChatApi.connect(async (response) => {
            if (response.type === "text") {
              await createAIMessage(userId, response.content);
            } else if (response.type === "speech") {
              const audio = new Audio(
                `data:audio/wav;base64,${response.content}`
              );
              await audio.play();
            }
          });
          setIsWSConnected(true);
        }

        // ユーザーメッセージを保存
        await createUserMessage(userId);

        // WebSocketを通じてメッセージを送信
        await AiChatApi.sendMessage(voiceInputMsg);
      } catch (error) {
        console.error("Error in toggleListening:", error);
        setIsWSConnected(false);
      }
    } else {
      recognition.start();
      setIsListening(true);
    }
  }, [isListening, recognition, voiceInputMsg, isWSConnected, userId]);

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
    isWSConnected,
    toggleListening,
    stopConversation,
  };
};
