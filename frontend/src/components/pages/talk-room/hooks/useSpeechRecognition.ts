"use client";
// import { voiceInputActions } from "@/stores/voiceInput";
import { useState, useEffect, useRef } from "react";

// WindowオブジェクトにwebkitSpeechRecognitionプロパティを追加するためのグローバルインターフェースを宣言
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export type SpeechRecognitionHookReturn = {
  isRecording: boolean;
  recordingComplete: boolean;
  transcript: string;
  handleToggleRecording: () => void;
};

/**
 * User の音声入力情報を管理するカスタムフック
 */
export const useSpeechRecognition = (): SpeechRecognitionHookReturn => {
  // 録音中かどうか
  const [isRecording, setIsRecording] = useState(false);
  // 録音が完了したかどうか
  const [recordingComplete, setRecordingComplete] = useState(false);
  // 録音結果
  const [transcript, setTranscript] = useState("");

  // SpeechRecognitionインスタンスを保存するための参照 Ref
  const recognitionRef = useRef<any>(null);

  // 録音開始 Func
  const startRecording = () => {
    setIsRecording(true);
    // ブラウザのSpeechRecognition（音声認識）APIの新しいインスタンスを作成
    const speech = new window.webkitSpeechRecognition();
    // 言語設定: 日本語
    speech.lang = "ja-JP";
    // インスタンスを Ref に保存
    recognitionRef.current = speech;

    // 音声認識を連続モードに設定することで、ユーザーが停止するまで音声認識が続行される。
    recognitionRef.current.continuous = true;

    // 暫定的な音声認識の結果を取得できるように設定
    // ユーザーが話し終える前に部分的な結果を得ることができます。
    recognitionRef.current.interimResults = true;

    // 音声認識の結果を処理するイベントハンドラーを定義
    recognitionRef.current.onresult = (event: any) => {
      console.log(event.results);
      // 最新の認識結果からtranscript（認識されたテキスト）を取得
      const { transcript } = event.results[event.results.length - 1][0];

      setTranscript(transcript); // Local State
      // voiceInputActions.setTranscript(transcript); // Global State
    };

    // 録音開始
    recognitionRef.current.start();
  };

  // Cleanup effect when the component unmounts
  useEffect(() => {
    // Cleanup function
    return () => {
      // 音声認識が有効な場合は停止させる
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // 録音停止 Func
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecordingComplete(true);
    }
  };

  // Start/Stop recording Toggle Func
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  return {
    isRecording,
    recordingComplete,
    transcript,
    handleToggleRecording,
  };
};
