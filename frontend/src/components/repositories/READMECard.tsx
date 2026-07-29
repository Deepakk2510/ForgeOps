import ReactMarkdown from "react-markdown";
import { FileText } from "lucide-react";

import EditReadmeDialog from "./EditReadmeDialog";

interface Props {
  repositoryId: string;
  readme: string;
}

export default function READMECard({
  repositoryId,
  readme,
}: Props) {
  return (
    <div className="rounded-xl border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5" />

          <h2 className="text-lg font-semibold">
            README.md
          </h2>
        </div>

        <EditReadmeDialog
          repositoryId={repositoryId}
          readme={readme}
        />
      </div>

      {/* Markdown Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none p-6">
        {readme?.trim() ? (
          <ReactMarkdown>{readme}</ReactMarkdown>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

            <h3 className="text-lg font-medium">
              No README Found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              This repository doesn't have a README yet.
              Click <strong>Edit README</strong> to create one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}