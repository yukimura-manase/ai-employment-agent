import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface EntrySheetMarkdownViewProps {
  entrySheet: string;
}

/**
 * エントリーシート・データをMarkdownで表示するコンポーネント
 */
export const EntrySheetMarkdownView = ({
  entrySheet,
}: EntrySheetMarkdownViewProps) => {
  return (
    <div className="w-[90%] h-[70%] bg-gray-100 rounded-lg p-5 overflow-y-scroll">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{entrySheet}</ReactMarkdown>
    </div>
  );
};
