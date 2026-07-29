import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ReviewStatus } from "@/types/pull-request";

export default function ReviewPullRequestDialog({ open, onOpenChange, onSubmit }: { open: boolean; onOpenChange: (open: boolean) => void; onSubmit: (status: ReviewStatus, comment: string) => void }) {
  const [comment, setComment] = useState("");
  const submit = (status: ReviewStatus) => { onSubmit(status, comment); setComment(""); onOpenChange(false); };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Review pull request</DialogTitle></DialogHeader><Textarea placeholder="Add review feedback (optional)" value={comment} onChange={(e) => setComment(e.target.value)} /><DialogFooter><Button variant="outline" onClick={() => submit("Changes Requested")}>Request changes</Button><Button onClick={() => submit("Approved")}>Approve</Button></DialogFooter></DialogContent></Dialog>;
}
