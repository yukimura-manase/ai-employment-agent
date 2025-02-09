import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import style from "./style.module.css";
interface JobSearchResultViewProps {
  jobSearchResult: string;
}

/**
 * エントリーシート・データをMarkdownで表示するコンポーネント
 */
export const JobSearchResultView = ({
  jobSearchResult,
}: JobSearchResultViewProps) => {
  return (
    // 求人検索結果を表示する。
    <div
      className={`${style.markdownContent} w-[90%] h-[70%] bg-gray-100 rounded-lg p-5 overflow-y-scroll`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {jobSearchResult}
      </ReactMarkdown>
    </div>
  );
};
