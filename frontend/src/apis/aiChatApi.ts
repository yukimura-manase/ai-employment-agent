import { aiAgentUrl } from "@/constants/env";

interface ChatRequest {
  message: string;
}

interface ChatResponse {
  type: "text" | "speech";
  content: string;
}

export class AiChatApi {
  private constructor() {}
  private static ws: WebSocket | null = null;

  /**
   * WebSocket接続を開始
   */
  static async connect(
    onMessage: (response: ChatResponse) => void,
    onError?: (error: Event) => void
  ): Promise<WebSocket> {
    if (this.ws) {
      this.ws.close();
    }

    const wsUrl = aiAgentUrl.replace(/^http/, "ws");
    this.ws = new WebSocket(`${wsUrl}/ws/ai-chat`);

    this.ws.onmessage = (event) => {
      const response: ChatResponse = JSON.parse(event.data);
      onMessage(response);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      if (onError) onError(error);
    };

    return new Promise((resolve, reject) => {
      if (!this.ws) return reject("WebSocket not initialized");

      this.ws.onopen = () => resolve(this.ws!);
      this.ws.onerror = reject;
    });
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
