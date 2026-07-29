import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import IssueStatusBadge from "./IssueStatusBadge";
import EditIssueDialog from "./EditIssueDialog";
import DeleteIssueDialog from "./DeleteIssueDialog";

import { issueService } from "@/services/issue.service";

import type { Issue } from "@/types/issue";

interface Props {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export default function IssueDetailsDialog({
  issue,
  open,
  onOpenChange,
  onUpdated,
}: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const closeMutation = useMutation({
    mutationFn: () => issueService.close(issue!._id),
    onSuccess: onUpdated,
  });

  const reopenMutation = useMutation({
    mutationFn: () => issueService.reopen(issue!._id),
    onSuccess: onUpdated,
  });

  if (!issue) return null;

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{issue.title}</span>

              <IssueStatusBadge status={issue.status} />
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">

            <div>
              <h3 className="mb-2 font-semibold">
                Description
              </h3>

              <p className="whitespace-pre-wrap text-muted-foreground">
                {issue.description || "No description provided."}
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">
                Labels
              </h3>

              <div className="flex flex-wrap gap-2">
                {issue.labels.length === 0 ? (
                  <span className="text-muted-foreground">
                    No Labels
                  </span>
                ) : (
                  issue.labels.map((label) => (
                    <Badge
                      key={label}
                      variant="outline"
                    >
                      {label}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 rounded-lg border p-4">

              <div>
                <p className="text-sm text-muted-foreground">
                  Priority
                </p>

                <p className="font-medium">
                  {issue.priority}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Status
                </p>

                <p className="font-medium">
                  {issue.status}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Created
                </p>

                <p>
                  {new Date(issue.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Updated
                </p>

                <p>
                  {new Date(issue.updatedAt).toLocaleString()}
                </p>
              </div>

            </div>

            <div className="flex flex-wrap justify-end gap-3">

              {issue.status === "Closed" ? (
                <Button
                  variant="secondary"
                  onClick={() =>
                    reopenMutation.mutate()
                  }
                  disabled={reopenMutation.isPending}
                >
                  Reopen
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() =>
                    closeMutation.mutate()
                  }
                  disabled={closeMutation.isPending}
                >
                  Close Issue
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() =>
                  setEditOpen(true)
                }
              >
                Edit
              </Button>

              <Button
                variant="destructive"
                onClick={() =>
                  setDeleteOpen(true)
                }
              >
                Delete
              </Button>

            </div>

          </div>
        </DialogContent>
      </Dialog>

      <EditIssueDialog
        issue={issue}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={() => {
          onUpdated();
          setEditOpen(false);
        }}
      />

      <DeleteIssueDialog
        issue={issue}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => {
          onUpdated();
          setDeleteOpen(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}