import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { pullRequestService } from "@/services/pull-request.service";
import { aiService } from "@/services/ai.service";

export default function CreatePullRequestDialog({ repositoryId, onCreated }: { repositoryId: string; onCreated: () => void }) {
  const [open, setOpen] = useState(false); const [title, setTitle] = useState(""); const [description, setDescription] = useState(""); const [sourceBranch, setSourceBranch] = useState(""); const [targetBranch, setTargetBranch] = useState("main"); const [reviewers, setReviewers] = useState(""); const [changedFiles, setChangedFiles] = useState("0"); const [commits, setCommits] = useState("0");
  const [isGenerating, setIsGenerating] = useState(false);
  const create = useMutation({ mutationFn: pullRequestService.create, onSuccess: () => { setOpen(false); setTitle(""); setDescription(""); setSourceBranch(""); onCreated(); } });
  const generateDescription = async () => {
    if (!sourceBranch.trim()) return;
    setIsGenerating(true);
    try {
      const res = await aiService.generatePRDescription(repositoryId, sourceBranch);
      if (res.data?.title) setTitle(res.data.title);
      if (res.data?.description) setDescription(res.data.description);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };
  return <><Button onClick={() => setOpen(true)}>Create pull request</Button><Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-xl"><DialogHeader><DialogTitle>Create pull request</DialogTitle></DialogHeader><div className="space-y-3"><Input required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /><Input required placeholder="Source branch" value={sourceBranch} onChange={(e) => setSourceBranch(e.target.value)} /><Input required placeholder="Target branch" value={targetBranch} onChange={(e) => setTargetBranch(e.target.value)} /><Input placeholder="Reviewer user IDs, comma-separated" value={reviewers} onChange={(e) => setReviewers(e.target.value)} /><div className="grid grid-cols-2 gap-3"><Input min="0" type="number" placeholder="Changed files" value={changedFiles} onChange={(e) => setChangedFiles(e.target.value)} /><Input min="0" type="number" placeholder="Commits" value={commits} onChange={(e) => setCommits(e.target.value)} /></div>
    <div className="flex justify-between items-center"><span className="text-sm font-medium">Description</span><Button variant="outline" size="sm" onClick={generateDescription} disabled={isGenerating || !sourceBranch.trim()}><Sparkles className="mr-2 h-4 w-4 text-primary" />{isGenerating ? "Generating..." : "AI Auto-fill"}</Button></div>
    <Textarea placeholder="Describe the changes" value={description} onChange={(e) => setDescription(e.target.value)} /></div><DialogFooter><Button disabled={!title.trim() || !sourceBranch.trim() || create.isPending} onClick={() => create.mutate({ repository: repositoryId, title, description, reviewers: reviewers.split(",").map((id) => id.trim()).filter(Boolean), sourceBranch, targetBranch, changedFiles: Number(changedFiles), commits: Number(commits) })}>Create</Button></DialogFooter></DialogContent></Dialog></>;
}
