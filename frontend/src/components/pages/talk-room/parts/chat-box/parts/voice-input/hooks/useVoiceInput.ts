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
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // @ts-ignore
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  type SpeechRecognition = typeof SpeechRecognition;

  // 音声認識インスタンス
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  // WebSocket接続の初期化
  useEffect(() => {
    let isSubscribed = true;

    const initializeWebSocket = async () => {
      try {
        if (!isConnected) {
          await AiChatApi.connect(
            async (response) => {
              if (response.type === "text") {
                await createAIMessage(userId, response.content);
              } else if (response.type === "speech") {
                const audio = new Audio(
                  `data:audio/wav;base64,${response.content}`
                );
                await audio.play();
              }
            },
            (error) => {
              console.error("WebSocket error:", error);
              if (isSubscribed) {
                setIsConnected(false);
              }
            }
          );
          if (isSubscribed) {
            setIsConnected(true);
          }
        }
      } catch (error) {
        console.error("Failed to connect:", error);
        if (isSubscribed) {
          setIsConnected(false);
        }
      }
    };

    initializeWebSocket();

    return () => {
      isSubscribed = false;
      AiChatApi.disconnect();
    };
  }, [userId, isConnected]);

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
        if (!isConnected) {
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
          setIsConnected(true);
        }

        // ユーザーメッセージを保存
        await createUserMessage(userId);

        // WebSocketを通じてメッセージを送信
        await AiChatApi.sendMessage(voiceInputMsg);
      } catch (error) {
        console.error("Error in toggleListening:", error);
        setIsConnected(false);
      }
    } else {
      recognition.start();
      setIsListening(true);
    }
  }, [isListening, recognition, voiceInputMsg, isConnected, userId]);

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
    isConnected,
    toggleListening,
    stopConversation,
  };
};
