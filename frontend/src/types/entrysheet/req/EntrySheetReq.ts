export interface CreateEntrySheetReq {
  userId: string;
  userInformation: string;
  systemPrompt: string;
  needProperties: {
    [key: string]: {
      type: string;
    };
  };
}

// NOTE: exampleは、次のとおり。
// {
//   "userId": "string",
//   "userInformation": "string",
//   "systemPrompt": "\nあなたはプロの就職エージェントです。\n顧客の情報が入力されるので、その情報に基づいて\nエントリーシートを作成してください。\n\nエントリーシートに必要な項目は\nStructured Outputとして指定しています。\nこれら項目の文章をOutputとして出力してください。\n",
//   "needProperties": {
//     "自己PR": {
//       "type": "STRING"
//     },
//     "技術的な経験": {
//       "type": "STRING"
//     }
//   }
// }
