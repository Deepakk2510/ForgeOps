import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { repositoryService } from "@/services/repository.service";

interface DeleteRepositoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repositoryId: string;
  repositoryName: string;
}

export default function DeleteRepositoryDialog({
  open,
  onOpenChange,
  repositoryId,
  repositoryName,
}: DeleteRepositoryDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => repositoryService.delete(repositoryId),

    onSuccess: () => {
      toast.success("Repository deleted successfully!");

      queryClient.invalidateQueries({
        queryKey: ["repositories"],
      });

      onOpenChange(false);
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ??
          "Failed to delete repository."
      );
    },
  });

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Repository
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>{repositoryName}</strong>?
            <br />
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() => mutation.mutate()}
            className="bg-red-600 hover:bg-red-700"
          >
            {mutation.isPending
              ? "Deleting..."
              : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}