import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {jobSearchResult}
      </ReactMarkdown>
    </div>
  );
};
