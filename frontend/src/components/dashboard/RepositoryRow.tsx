import { useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  FolderGit2,
  Clock3,
  Star,
  Pencil,
  Trash2,
} from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import { repositoryService } from "@/services/repository.service";

import type { Repository } from "@/types/repository";

import EditRepositoryDialog from "@/components/repositories/EditRepositoryDialog";
import DeleteRepositoryDialog from "@/components/repositories/DeleteRepositoryDialog";

interface RepositoryRowProps {
  repository: Repository;
}

export default function RepositoryRow({
  repository,
}: RepositoryRowProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const starMutation = useMutation({
    mutationFn: () =>
      repositoryService.toggleStar(repository._id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["repositories"],
      });
    },
  });

  const {
    name,
    language,
    stars,
    status,
    isStarred,
  } = repository;

  const lastCommit = "Just now";

  const openRepository = () => {
    navigate(`/repositories/${repository._id}`);
  };

  const stopRowNavigation = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const handleRowKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openRepository();
    }
  };

  const statusColor = {
    Active:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",

    Building:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",

    Archived:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  };

  return (
    <>
      <div
        role="link"
        tabIndex={0}
        onClick={openRepository}
        onKeyDown={handleRowKeyDown}
        className="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-muted/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >

        <div className="flex items-center gap-4">

          <div className="rounded-lg bg-primary/10 p-3">
            <FolderGit2 className="h-6 w-6 text-primary" />
          </div>

          <div>
            <h3 className="font-semibold">
              {name}
            </h3>

            <p className="text-sm text-muted-foreground">
              {language}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-6">

          <button
            onClick={(event) => {
              stopRowNavigation(event);
              starMutation.mutate();
            }}
            className="flex items-center gap-2 text-sm transition hover:scale-105"
          >
            <Star
              className={`h-4 w-4 ${
                isStarred
                  ? "fill-yellow-400 text-yellow-400"
                  : ""
              }`}
            />

            {stars}
          </button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="h-4 w-4" />
            {lastCommit}
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[status]}`}
          >
            {status}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={(event) => {
              stopRowNavigation(event);
              setEditOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={(event) => {
              stopRowNavigation(event);
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

        </div>

      </div>

      <EditRepositoryDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        repository={repository}
      />

      <DeleteRepositoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        repositoryId={repository._id}
        repositoryName={repository.name}
      />
    </>
  );
}
