import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GitPullRequest } from "lucide-react";

import CreatePullRequestDialog from "@/components/pull-requests/CreatePullRequestDialog";
import PullRequestCard from "@/components/pull-requests/PullRequestCard";
import PullRequestDetailsDialog from "@/components/pull-requests/PullRequestDetailsDialog";
import { pullRequestService } from "@/services/pull-request.service";
import type { PullRequest } from "@/types/pull-request";

export default function PullRequestsPage() {
  const { repositoryId } = useParams<{ repositoryId: string }>();
  const queryClient = useQueryClient();
  const [selectedPullRequest, setSelectedPullRequest] = useState<PullRequest | null>(null);
  const { data, isLoading, isError } = useQuery({ queryKey: ["pull-requests", repositoryId], queryFn: () => pullRequestService.getRepositoryPullRequests(repositoryId!), enabled: !!repositoryId });

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["pull-requests", repositoryId] });
    void queryClient.invalidateQueries({ queryKey: ["repository", repositoryId] });
    void queryClient.invalidateQueries({ queryKey: ["repositories"] });
    void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  if (isLoading) return <div className="py-20 text-center text-muted-foreground">Loading pull requests…</div>;
  if (isError) return <div className="py-20 text-center text-destructive">Failed to load pull requests.</div>;

  const pullRequests = data?.data || [];
  return <div className="mx-auto max-w-6xl space-y-6 p-8">
    <div className="flex items-start justify-between gap-4"><div><h1 className="flex items-center gap-3 text-3xl font-bold"><GitPullRequest />Pull Requests</h1><p className="mt-1 text-muted-foreground">Create, review, approve, merge, close, and reopen repository changes.</p></div><CreatePullRequestDialog repositoryId={repositoryId!} onCreated={refresh} /></div>
    <div className="space-y-4">{pullRequests.length ? pullRequests.map((pullRequest) => <PullRequestCard key={pullRequest._id} pullRequest={pullRequest} onClick={() => setSelectedPullRequest(pullRequest)} />) : <div className="rounded-xl border py-14 text-center text-muted-foreground">No pull requests yet.</div>}</div>
    <PullRequestDetailsDialog pullRequest={selectedPullRequest} open={!!selectedPullRequest} onOpenChange={(open) => { if (!open) setSelectedPullRequest(null); }} onUpdated={refresh} />
  </div>;
}
