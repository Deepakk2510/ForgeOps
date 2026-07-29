import { Badge } from "@/components/ui/badge";
import type { MergeStatus, PullRequestStatus } from "@/types/pull-request";

export default function PullRequestStatusBadge({ status }: { status: PullRequestStatus | MergeStatus }) {
  const variant = status === "Merged" || status === "Approved" ? "default" : status === "Closed" || status === "Rejected" ? "outline" : "secondary";
  const className = status === "Closed" || status === "Rejected" ? "border-destructive/40 text-destructive" : "";
  return <Badge variant={variant} className={className}>{status}</Badge>;
}
