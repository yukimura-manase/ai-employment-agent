import { aiAgentUrl } from "@/constants/env";
import { CreateJobSearchReq } from "@/types/job-search/req/JobSearchReq";
import { CreateJobSearchRes } from "@/types/job-search/res/JobSearchRes";

export class JobSearchApi {
  private constructor() {}

  /**
   * 求人情報検索API Caller
   */
  static async createJobSearch(
    req: CreateJobSearchReq
  ): Promise<CreateJobSearchRes> {
    const res = await fetch(`${aiAgentUrl}/job-search/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return res.json();
  }
}
