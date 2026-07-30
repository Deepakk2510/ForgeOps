import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GitBranch, GitCommitHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { versionControlService } from "@/services/version-control.service";
import { aiService } from "@/services/ai.service";
import type { Commit } from "@/types/version-control";

export default function VersionControlPage() {
  const { repositoryId } = useParams<{ repositoryId: string }>(); const queryClient = useQueryClient(); const [branchName, setBranchName] = useState(""); const [message, setMessage] = useState(""); const [files, setFiles] = useState(""); const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const branches = useQuery({ queryKey: ["branches", repositoryId], queryFn: () => versionControlService.branches(repositoryId!), enabled: !!repositoryId });
  const currentBranch = branches.data?.data.find((branch) => branch.isCurrent);
  const commits = useQuery({ queryKey: ["commits", repositoryId, currentBranch?._id], queryFn: () => versionControlService.commits(repositoryId!, currentBranch?._id), enabled: !!repositoryId && !!currentBranch });
  const refresh = () => { void queryClient.invalidateQueries({ queryKey: ["branches", repositoryId] }); void queryClient.invalidateQueries({ queryKey: ["commits", repositoryId] }); void queryClient.invalidateQueries({ queryKey: ["repository", repositoryId] }); };
  const createBranch = useMutation({ mutationFn: () => versionControlService.createBranch(repositoryId!, branchName), onSuccess: () => { setBranchName(""); refresh(); } });
  const switchBranch = useMutation({ mutationFn: versionControlService.switchBranch, onSuccess: refresh }); const deleteBranch = useMutation({ mutationFn: versionControlService.deleteBranch, onSuccess: refresh });
  const createCommit = useMutation({ mutationFn: () => versionControlService.createCommit(currentBranch!._id, message, files.split("\n").map((file) => file.trim()).filter(Boolean)), onSuccess: () => { setMessage(""); setFiles(""); refresh(); } });
  
  const generateMessage = async () => {
    if (!currentBranch) return;
    setIsGenerating(true);
    try {
      const res = await aiService.generateCommitMessage(repositoryId!, currentBranch.name);
      if (res.data) setMessage(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  if (branches.isLoading) return <div className="py-20 text-center text-muted-foreground">Loading version control…</div>;
  return <div className="mx-auto max-w-6xl space-y-7 p-8"><div><h1 className="flex items-center gap-2 text-3xl font-bold"><GitBranch />Branches & Commits</h1><p className="mt-1 text-muted-foreground">Simulate repository version control.</p></div><div className="grid gap-6 lg:grid-cols-3"><section className="space-y-4 rounded-xl border p-5"><h2 className="font-semibold">Branch manager</h2><div className="flex gap-2"><Input placeholder="feature/my-work" value={branchName} onChange={(e) => setBranchName(e.target.value)} /><Button disabled={!branchName || createBranch.isPending} onClick={() => createBranch.mutate()}>Create</Button></div><div className="space-y-2">{branches.data?.data.map((branch) => <div key={branch._id} className="flex items-center justify-between rounded-lg border p-3"><button className="text-left" onClick={() => !branch.isCurrent && switchBranch.mutate(branch._id)}><strong>{branch.name}</strong><p className="text-xs text-muted-foreground">{branch.isCurrent ? "Current branch" : branch.isDefault ? "Default branch" : "Switch to this branch"}</p></button>{!branch.isCurrent && !branch.isDefault && <Button size="icon-sm" variant="destructive" onClick={() => deleteBranch.mutate(branch._id)}><Trash2 /></Button>}</div>)}</div></section><section className="space-y-4 rounded-xl border p-5 lg:col-span-2"><div className="flex justify-between items-center"><h2 className="font-semibold">Commit on {currentBranch?.name || "…"}</h2><Button variant="outline" size="sm" onClick={generateMessage} disabled={isGenerating || !currentBranch}><Sparkles className="mr-2 h-4 w-4 text-primary" />{isGenerating ? "Generating..." : "AI Message"}</Button></div><Input placeholder="Commit message" value={message} onChange={(e) => setMessage(e.target.value)} /><Textarea placeholder="Changed files, one per line" value={files} onChange={(e) => setFiles(e.target.value)} /><Button disabled={!message || createCommit.isPending} onClick={() => createCommit.mutate()}>Create commit</Button><div className="space-y-3 border-t pt-4"><h2 className="font-semibold">Commit timeline</h2>{commits.data?.data.length ? commits.data.data.map((commit) => <button key={commit._id} onClick={() => setSelectedCommit(commit)} className="flex w-full items-center gap-3 rounded-lg border p-4 text-left hover:bg-muted/50"><GitCommitHorizontal /><div><strong>{commit.message}</strong><p className="text-sm text-muted-foreground">{commit.hash} · {new Date(commit.createdAt).toLocaleString()}</p></div></button>) : <p className="text-muted-foreground">No commits on this branch.</p>}</div></section></div><Dialog open={!!selectedCommit} onOpenChange={(open) => { if (!open) setSelectedCommit(null); }}><DialogContent><DialogHeader><DialogTitle>Commit details</DialogTitle></DialogHeader>{selectedCommit && <div className="space-y-3"><p className="font-semibold">{selectedCommit.message}</p><p className="text-sm text-muted-foreground">{selectedCommit.hash} · {selectedCommit.author?.name}</p><div><h3 className="font-medium">Changed files</h3>{selectedCommit.changedFiles.length ? <ul className="mt-2 list-disc pl-5">{selectedCommit.changedFiles.map((file) => <li key={file}>{file}</li>)}</ul> : <p className="text-muted-foreground">No file list provided.</p>}</div></div>}</DialogContent></Dialog></div>;
}
