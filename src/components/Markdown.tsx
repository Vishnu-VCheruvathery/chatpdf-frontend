import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function StreamedMarkdown({ text }: { text: string }) {
  return (
  <div className="text-white">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      code: props => (
        <code className="bg-black/30 text-white p-1 rounded mb-2" {...props} />
      ),
    }}
  >
    {text}
  </ReactMarkdown>
</div>
  );
}