import type { Message } from "@prisma/client";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * AIキャリア・アドバイザーのシステムプロンプト(人格設定)
 */
export const createSystemPrompt = ({
  userQuery,
  aiAnswer,
}: {
  userQuery: string;
  aiAnswer: string;
}): string => {
  return `
    あなたは、就職活動・転職活動の相談のプロである、キャリア・アドバイザーです。
    また、あなたは、以下の制約条件と回答条件を厳密に守る必要があります。

    制約条件:
    * あなたは、就職活動・転職活動の相談のプロである、キャリア・アドバイザーであり、それ以外の質問には回答しません。
    * あなたは、お客さんにとって有益な回答をするために、適切にヒアリングを行います。
    * ヒアリングすべき内容は、「ヒアリング内容・質問すべき内容」にまとめたとおりです。
    * ヒアリングすべき内容は、必ず質問してください。すでに質問されている内容については、質問しなくても構いません。
    * お客さんからヒアリングすべき内容、必要な情報をすべて聞き取ってください。
  
    ヒアリング内容・質問すべき内容:
    1. お客さんの就職・転職を目指す業種・業界を理解する質問。
      - 例) どんな業種・業界を目指していますか？
    2. お客さんの目指す職業・職種を理解する質問。
      - 例) どんな職業・職種を目指していますか？
    3. お客さんの就職・転職先に対する希望条件を理解する。
      - 仕事内容
        - 例) どんな仕事内容が希望ですか？
      - 給与
        - 例) お給料は、いくらくらい希望していますか？
      - 働き方
        - 例) どんな働き方を希望していますか？ (リモートワーク、フレックス勤務、フルタイム、パートタイム、フリーランス、その他など)
    4. お客さんの学歴
      - 例) 学歴について、教えてください。
    5. お客さんの職歴をヒアリングする。
      - 例) 職歴について、教えてください。
    6. お客さんの仕事で活かせるスキルをヒアリングする。
      - 例) 仕事で活かせるスキルについて、教えてください。
    7. お客さんのその他の希望条件をヒアリングする。
      - 例) その他の希望条件について、何かあれば、教えてください。

    回答条件:
    * 丁寧な接客を心がけてください。
    * あなたは、お客さんのとの会話データ(会話のLog)の文章から、お客さんに適した回答をします。
    * ヒアリング内容・質問すべき内容を、必ず質問してください。
    * 回答に、お客さんのとの会話データ(Log)を含める必要はありません。
    * 1.などの番号や、ex) などのような、内容を回答には含めないでください。
    * 回答は、120文字以内で、簡潔にお願いします。

    お客さんのとの会話データ(Log):
    * お客さんの話しかけた内容: ${userQuery}
    * あなたの回答: ${aiAnswer}
  `;
};

/**
 * 回答フォーマット
 */
export const genAnswerFormat = () => {
  return `
    あなたは親切で知的なキャリア・アドバイザーです。ユーザーの質問に対して、簡潔で正確な回答を提供してください。
  `;
};

/**
 * プロンプトテンプレートの作成
 *
 * - systemPrompt: AI側の人格設定など
 * - userQuery: ユーザーの質問
 */
export const createPromptTemplate = (
  systemPrompt: string
): ChatPromptTemplate<any, any> => {
  // プロンプトテンプレートの作成
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    // ユーザーの入力
    ["user", "{input}"],
  ]);

  return prompt;
};

/**
 * AI就活エージェント
 *
 * - 会話履歴と、最新メッセージを結合して、GeminiLangChainに渡す。
 * - GeminiLangChainでAIの回答を取得する。
 */
export const aiCareerAgent = async (
  apiKey: string,
  historyMessages: Message[],
  latestMessage: string
) => {
  console.log("aiCareerAgent Start");

  // ユーザーの会話データを結合する。
  const userMessagesStr: string = historyMessages
    .filter((message) => message.sender === "USER")
    .map((message) => message.content)
    .join("\n");

  // AIの会話データを結合する。
  const aiMessagesStr: string = historyMessages
    .filter((message) => message.sender === "AI")
    .map((message) => message.content)
    .join("\n");

  // システムプロンプトを作成する。
  const systemPrompt: string = createSystemPrompt({
    userQuery: userMessagesStr,
    aiAnswer: aiMessagesStr,
  });
  console.log("systemPrompt", systemPrompt);

  // プロンプトテンプレートを作成する。
  const promptTemplate: ChatPromptTemplate<any, any> =
    createPromptTemplate(systemPrompt);

  // Geminiのモデルを作成する
  const geminiModel: ChatGoogleGenerativeAI = new ChatGoogleGenerativeAI({
    apiKey,
    modelName: "gemini-pro",
    maxOutputTokens: 2048,
    temperature: 0.7,
  });

  // 出力パーサーを作成する。
  const outputParser = new StringOutputParser();

  // チェーンを作成する。
  const llmChain = promptTemplate.pipe(geminiModel).pipe(outputParser);

  const aiAnswer: string = await llmChain.invoke({
    input: latestMessage,
  });
  return aiAnswer;
};
