import { serverUrl } from "@/constants/env";
import { CreateEntrySheetReq } from "@/types/entrysheet/req/EntrySheetReq";
import { CreateEntrySheetRes } from "@/types/entrysheet/res/EntrySheetRes";

export class EntrySheetApi {
  private constructor() {}

  /**
   * エントリーシートを作成するAPI
   */
  static async createEntrySheet(
    req: CreateEntrySheetReq
  ): Promise<CreateEntrySheetRes> {
    const res = await fetch(`${serverUrl}/entrysheet/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return res.json();
  }
}
