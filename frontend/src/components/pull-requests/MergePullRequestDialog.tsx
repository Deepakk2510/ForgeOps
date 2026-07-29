import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function MergePullRequestDialog({ open, onOpenChange, onMerge }: { open: boolean; onOpenChange: (open: boolean) => void; onMerge: () => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Merge pull request?</DialogTitle></DialogHeader><p className="text-muted-foreground">This will merge the approved changes and update repository analytics.</p><DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={() => { onMerge(); onOpenChange(false); }}>Merge pull request</Button></DialogFooter></DialogContent></Dialog>;
}
