import { GitPullRequest } from "lucide-react";
import PullRequestStatusBadge from "./PullRequestStatusBadge";
import type { PullRequest } from "@/types/pull-request";

export default function PullRequestCard({ pullRequest, onClick }: { pullRequest: PullRequest; onClick: () => void }) {
  return <button onClick={onClick} className="w-full rounded-xl border p-5 text-left transition hover:bg-muted/50">
    <div className="flex items-start justify-between gap-4"><div><h2 className="flex items-center gap-2 text-lg font-semibold"><GitPullRequest className="size-5" />{pullRequest.title}</h2><p className="mt-1 text-sm text-muted-foreground">{pullRequest.sourceBranch} → {pullRequest.targetBranch} · {pullRequest.changedFiles} files · {pullRequest.commits} commits</p></div><div className="flex gap-2"><PullRequestStatusBadge status={pullRequest.status} /><PullRequestStatusBadge status={pullRequest.mergeStatus} /></div></div>
    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{pullRequest.description || "No description provided."}</p>
  </button>;
}
