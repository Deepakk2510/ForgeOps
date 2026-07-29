import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PullRequestStatusBadge from "./PullRequestStatusBadge";
import ReviewPullRequestDialog from "./ReviewPullRequestDialog";
import MergePullRequestDialog from "./MergePullRequestDialog";
import { pullRequestService } from "@/services/pull-request.service";
import type { PullRequest, ReviewStatus } from "@/types/pull-request";

export default function PullRequestDetailsDialog({ pullRequest, open, onOpenChange, onUpdated }: { pullRequest: PullRequest | null; open: boolean; onOpenChange: (open: boolean) => void; onUpdated: () => void }) {
  const [reviewOpen, setReviewOpen] = useState(false); const [mergeOpen, setMergeOpen] = useState(false); const update = () => { onUpdated(); };
  const review = useMutation({ mutationFn: ({ status, reviewComment }: { status: ReviewStatus; reviewComment: string }) => pullRequestService.review(pullRequest!._id, status, reviewComment), onSuccess: update });
  const merge = useMutation({ mutationFn: () => pullRequestService.merge(pullRequest!._id), onSuccess: update });
  const close = useMutation({ mutationFn: () => pullRequestService.close(pullRequest!._id), onSuccess: update });
  const reopen = useMutation({ mutationFn: () => pullRequestService.reopen(pullRequest!._id), onSuccess: update });
  const remove = useMutation({ mutationFn: () => pullRequestService.delete(pullRequest!._id), onSuccess: () => { update(); onOpenChange(false); } });
  if (!pullRequest) return null;
  return <><Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle className="flex items-center gap-2">{pullRequest.title}<PullRequestStatusBadge status={pullRequest.status} /><PullRequestStatusBadge status={pullRequest.mergeStatus} /></DialogTitle></DialogHeader><div className="space-y-4"><p className="whitespace-pre-wrap text-muted-foreground">{pullRequest.description || "No description provided."}</p><div className="grid grid-cols-2 gap-3 rounded-lg border p-4 text-sm"><span>Branches</span><strong>{pullRequest.sourceBranch} → {pullRequest.targetBranch}</strong><span>Changed files</span><strong>{pullRequest.changedFiles}</strong><span>Commits</span><strong>{pullRequest.commits}</strong><span>Created</span><strong>{new Date(pullRequest.createdAt).toLocaleString()}</strong></div><div className="space-y-2"><h3 className="font-semibold">Reviews</h3>{pullRequest.reviews.length ? pullRequest.reviews.map((item) => <p key={item._id} className="text-sm">{item.status}{item.comment ? `: ${item.comment}` : ""}</p>) : <p className="text-sm text-muted-foreground">No reviews yet.</p>}</div></div><DialogFooter>{pullRequest.status === "Open" ? <><Button variant="outline" onClick={() => setReviewOpen(true)}>Review</Button><Button disabled={pullRequest.mergeStatus !== "Approved" || merge.isPending} onClick={() => setMergeOpen(true)}>Merge</Button><Button variant="destructive" onClick={() => close.mutate()}>Close</Button></> : pullRequest.status === "Closed" ? <Button onClick={() => reopen.mutate()}>Reopen</Button> : null}<Button variant="destructive" onClick={() => { if (window.confirm("Delete this pull request?")) remove.mutate(); }}>Delete</Button></DialogFooter></DialogContent></Dialog><ReviewPullRequestDialog open={reviewOpen} onOpenChange={setReviewOpen} onSubmit={(status, reviewComment) => review.mutate({ status, reviewComment })} /><MergePullRequestDialog open={mergeOpen} onOpenChange={setMergeOpen} onMerge={() => merge.mutate()} /></>;
}
