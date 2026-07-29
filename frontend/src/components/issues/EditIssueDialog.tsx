import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { issueService } from "@/services/issue.service";

import type { Issue } from "@/types/issue";

interface Props {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export default function EditIssueDialog({
  issue,
  open,
  onOpenChange,
  onUpdated,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description);
    }
  }, [issue]);

  const mutation = useMutation({
    mutationFn: () =>
      issueService.update(issue!._id, {
        title,
        description,
      }),
    onSuccess: () => {
      onUpdated();
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
            Edit Issue
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Issue title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <Textarea
            rows={6}
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <Button
            className="w-full"
            onClick={() =>
              mutation.mutate()
            }
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Updating..."
              : "Update Issue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}