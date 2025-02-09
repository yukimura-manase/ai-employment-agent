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
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{entrySheet}</ReactMarkdown>
    </div>
  );
};
