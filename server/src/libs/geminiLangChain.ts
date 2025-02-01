import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";

/**
 * 汎用Gemini Class
 *
 *
 */
export class GeminiLangChain {
  private model: ChatGoogleGenerativeAI;
  private memory: BufferMemory;
  private chain: RunnableSequence;

  constructor(arg: {
    apiKey: string;
    modelName: string;
    maxOutputTokens: number;
    temperature: number;
  }) {
    // Gemini Proモデルの初期化
    this.model = new ChatGoogleGenerativeAI({
      apiKey: arg.apiKey,
      modelName: "gemini-pro",
      maxOutputTokens: 2048,
      temperature: 0.7,
    });

    // メモリの初期化
    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "chat_history",
    });

    // プロンプトテンプレートの作成
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "あなたは親切で知的なAIアシスタントです。ユーザーの質問に対して、簡潔で正確な回答を提供してください。",
      ],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
    ]);

    // チェーンの構築
    this.chain = RunnableSequence.from([
      {
        input: new RunnablePassthrough(),
        chat_history: async () => {
          const history = await this.memory.loadMemoryVariables({});
          return history.chat_history;
        },
      },
      prompt,
      this.model,
      new StringOutputParser(),
    ]);
  }

  async chat(message: string): Promise<string> {
    try {
      // チェーンを実行して応答を生成
      const response = await this.chain.invoke({
        input: message,
      });

      // メモリに会話を保存
      await this.memory.saveContext({ input: message }, { output: response });

      return response;
    } catch (error) {
      console.error("チャットエラー:", error);
      throw new Error("チャット処理中にエラーが発生しました");
    }
  }

  async clearMemory(): Promise<void> {
    try {
      await this.memory.clear();
    } catch (error) {
      console.error("メモリクリアエラー:", error);
      throw new Error("メモリのクリア中にエラーが発生しました");
    }
  }

  // 会話履歴を取得するメソッド
  async getChatHistory(): Promise<BaseMessage[]> {
    const history = await this.memory.loadMemoryVariables({});
    return history.chat_history as BaseMessage[];
  }
}
