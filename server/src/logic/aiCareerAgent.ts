import type { Message, UserWorkProfile } from "@prisma/client";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { UserWorkProfileRes } from "@/types/user-work-profile/UserWorkProfileRes.js";

/**
 * AIキャリア・コンサルタントのシステムプロンプト(人格設定)
 */
export const createSystemPrompt = ({
  userQuery,
  aiAnswer,
  userWorkProfile,
}: {
  userQuery: string;
  aiAnswer: string;
  userWorkProfile: string;
}): string => {
  return `
    あなたは、就職活動・転職活動の相談のプロである、キャリア・コンサルタントです。
    また、あなたは、以下の制約条件と回答条件を厳密に守る必要があります。

    制約条件:
    * あなたは、就職活動・転職活動の相談のプロである、キャリア・コンサルタントであり、お客さんの就職・転職活動に関する質問にのみ回答します。
    * あなたは、お客さんにとって有益な回答をするために、情報から最適な就職・転職のアドバイスを行います。
    * お客さんのとの会話データ(Log)がある場合は、その情報を参考に質問や回答を考えてください。
    * お客さんの就活プロフィール情報がある場合は、その情報を参考に質問や回答を考えてください。
    * ヒアリングすべき内容は、「ヒアリング内容・質問すべき内容」にまとめたとおりです。
    * ヒアリングすべき内容は、必ず質問してください。すでに質問されている内容については、質問しなくても構いません。
    * ヒアリングすべき内容以外でも、お客さんにとって有益な回答をするために、質問してください。
  
    ヒアリング内容・質問すべき内容:
    1. お客さんの就職・転職をする理由についてヒアリングする。
      - 例) どんな理由で、就職・転職をすることを考えていますか？
    2. お客さんの転職で譲れない条件についてヒアリングする。
      - 例) 転職で譲れない条件について、教えてください。
    3. お客さんの仕事で活かせるスキルをヒアリングする。
      - 例) 仕事で活かせるスキルについて、教えてください。    

    回答条件:
    * 丁寧な接客を心がけてください。
    * あなたは、お客さんのとの会話データ(会話のLog)の文章から、お客さんに適した回答をします。
    * ヒアリング内容・質問すべき内容を、必ず質問してください。
    * 回答に、お客さんのとの会話データ(Log)を含める必要はありません。
    * 1.などの番号や、ex) などのような、内容を回答には含めないでください。
    * ヒアリングすべき内容以外でも、お客さんにとって有益な回答をするために、質問してください。
    * 回答は、120文字以内で、簡潔にお願いします。

    お客さんのとの会話データ(Log):
    * お客さんの話しかけた内容: ${userQuery}
    * あなたの回答: ${aiAnswer}

    ${userWorkProfile}
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
 * ユーザーの就活プロフィール情報のキーを、日本語に翻訳する。
 */
const keyTranslate = {
  // 現在の仕事に関するプロフィール情報
  currentIndustry: "現在の業界",
  currentJobType: "現在の職業",
  currentSalary: "現在の給与",
  currentCompany: "現在の会社",
  currentRole: "現在の役割",
  currentWorkStyle: "現在の働き方",

  // 目指す仕事に関するプロフィール情報
  targetIndustry: "目標の業界",
  targetJobType: "目標の職業",
  targetJobContent: "目標の仕事内容",
  targetSalary: "目標の給与",
  targetWorkStyle: "目標の働き方",
  targetCompany: "目標の会社",
  targetRole: "目標の役割",
  targetOtherConditions: "目標のその他の条件",
};

/**
 * ユーザーの就活プロフィール情報を、JSON形式でフォーマットする。
 *
 * 余計な情報は、非表示にする。
 */
const formatUserWorkProfilePrompt = (
  userWorkProfile: UserWorkProfileRes | null
): string => {
  if (!userWorkProfile) {
    return "";
  }
  const { userCurrentWork, userTargetWork } = userWorkProfile;

  const formatMatter = (target: object, excludeKeys: string[]): string => {
    const formattedStr = Object.entries(target)
      .map(([key, value]) => {
        // 値がない場合は、非表示にする。
        if (!value) {
          return;
        }
        // 余計な情報は、非表示にする。(id系, 作成日時, 更新日時など)
        if (excludeKeys.includes(key)) {
          return;
        }
        // key: value の形式にフォーマットする。(keyは、日本語に翻訳する)
        return `${keyTranslate[key as keyof typeof keyTranslate]}: ${value}`;
      })
      .filter((value) => value !== undefined) // undefined は、除外する。
      .join("\n");

    return formattedStr;
  };

  // userCurrentWork を 1つずつ key: value の形式で表示する。
  // ただし、ユーザーIDは、セキュリティのため、非表示にする。
  const userCurrentWorkStr = formatMatter(userCurrentWork, [
    "userId",
    "userWorkProfileId",
    "createdAt",
    "updatedAt",
  ]);

  // userTargetWork を 1つずつ key: value の形式で表示する。
  const userTargetWorkStr = formatMatter(userTargetWork, [
    "userId",
    "userWorkProfileId",
    "createdAt",
    "updatedAt",
  ]);

  return `
    お客さんの就活プロフィール情報: 
    * 現在の仕事: ${userCurrentWorkStr}
    * 目指す仕事: ${userTargetWorkStr}
  `;
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
  latestMessage: string,
  userWorkProfile: UserWorkProfileRes | null // 就活プロフィール情報
) => {
  console.log("aiCareerAgent Start");
  console.log("userWorkProfile", userWorkProfile);

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

  const userWorkProfilePrompt = formatUserWorkProfilePrompt(userWorkProfile);

  // システムプロンプトを作成する。
  const systemPrompt: string = createSystemPrompt({
    userQuery: userMessagesStr,
    aiAnswer: aiMessagesStr,
    userWorkProfile: userWorkProfilePrompt,
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
