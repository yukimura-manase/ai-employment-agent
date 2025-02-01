import { aiAgentUrl } from "@/constants/env";

interface ChatRequest {
  message: string;
}

interface ChatResponse {
  type: "text" | "speech";
  content: string;
}

/**
 * AIとリアルタイムで会話するAPI WebSocket実装
 */
export class AiRealTimeTalkApi {
  private constructor() {}
  private static ws: WebSocket | null = null;

  /**
   * WebSocket接続を開始
   */
  static async connect(
    onMessage: (response: ChatResponse) => void,
    onError?: (error: Event) => void
  ): Promise<WebSocket> {
    try {
      if (this.ws) {
        this.ws.close();
      }
      console.log("WebSocket connecting...");

      const wsUrl = aiAgentUrl.replace(/^http/, "ws");
      console.log("wsUrl:", wsUrl);

      this.ws = new WebSocket(`${wsUrl}/ai-chat/ws`);
      console.log("WebSocket instance created:", this.ws);

      this.ws.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
        const response: ChatResponse = JSON.parse(event.data);
        onMessage(response);
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error details:", error);
        if (onError) onError(error);
      };

      return new Promise((resolve, reject) => {
        if (!this.ws) return reject("WebSocket not initialized");

        this.ws.onopen = () => {
          console.log("WebSocket connection opened successfully");
          resolve(this.ws!);
        };

        // タイムアウト処理を追加
        const timeout = setTimeout(() => {
          reject(new Error("WebSocket connection timeout"));
        }, 5000);

        this.ws.onerror = (error) => {
          clearTimeout(timeout);
          console.error("WebSocket connection failed:", error);
          reject(error);
        };

        // 接続が閉じられた場合の処理
        this.ws.onclose = (event) => {
          clearTimeout(timeout);
          console.log("WebSocket connection closed:", event);
          if (!event.wasClean) {
            reject(new Error(`WebSocket closed unexpectedly: ${event.code}`));
          }
        };
      });
    } catch (error) {
      console.error("WebSocket connection error:", error);
      throw error;
    }
  }

  /**
   * メッセージを送信
   */
  static async sendMessage(message: string): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }

    this.ws.send(
      JSON.stringify({
        type: "message",
        message: message,
      })
    );
  }

  /**
   * 接続を終了
   */
  static disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
