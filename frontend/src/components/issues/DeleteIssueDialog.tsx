import { useMutation } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { issueService } from "@/services/issue.service";

import type { Issue } from "@/types/issue";

interface Props {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export default function DeleteIssueDialog({
  issue,
  open,
  onOpenChange,
  onDeleted,
}: Props) {
  const mutation = useMutation({
    mutationFn: () =>
      issueService.delete(issue!._id),
    onSuccess: () => {
      onDeleted();
      onOpenChange(false);
    },
  });

  if (!issue) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Issue
          </DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground">
          Are you sure you want to delete
          <strong> "{issue.title}" </strong>?
        </p>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={() =>
              mutation.mutate()
            }
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Deleting..."
              : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}