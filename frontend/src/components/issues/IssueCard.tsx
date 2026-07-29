import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import IssueStatusBadge from "./IssueStatusBadge";

import type { Issue } from "@/types/issue";

interface Props {
  issue: Issue;
}

export default function IssueCard({ issue }: Props) {
  return (
    <Card className="transition-all hover:border-primary hover:shadow-md">
      <CardContent className="space-y-4 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">
              {issue.title}
            </h3>

            <p className="text-sm text-muted-foreground">
              {issue.description || "No description provided."}
            </p>
          </div>

          <IssueStatusBadge status={issue.status} />
        </div>

        {/* Labels */}
        <div className="flex flex-wrap gap-2">
          {issue.labels.length > 0 ? (
            issue.labels.map((label: string) => (
              <Badge
                key={label}
                variant="outline"
              >
                {label}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">
              No labels
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t pt-3 text-sm text-muted-foreground">
          <div className="flex gap-6">
            <span>
              Priority:
              <strong className="ml-1">
                {issue.priority}
              </strong>
            </span>

            <span>
              Status:
              <strong className="ml-1">
                {issue.status}
              </strong>
            </span>
          </div>

          <span>
            {new Date(issue.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}