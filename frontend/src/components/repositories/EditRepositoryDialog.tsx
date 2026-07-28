import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { repositoryService } from "@/services/repository.service";

import type { Repository } from "@/types/repository";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repository: Repository | null;
}

interface RepositoryFormData {
  name: string;
  description: string;
  language: string;
  visibility: "Public" | "Private";
  status: "Active" | "Building" | "Archived";
}

export default function EditRepositoryDialog({
  open,
  onOpenChange,
  repository,
}: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RepositoryFormData>();

  useEffect(() => {
    if (repository) {
      reset({
        name: repository.name,
        description: repository.description,
        language: repository.language,
        visibility: repository.visibility,
        status: repository.status,
      });
    }
  }, [repository, reset]);

  const mutation = useMutation({
    mutationFn: (data: RepositoryFormData) =>
      repositoryService.update(repository!._id, data),

    onSuccess: () => {
      toast.success("Repository updated!");

      queryClient.invalidateQueries({
        queryKey: ["repositories"],
      });

      onOpenChange(false);
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ??
          "Failed to update repository."
      );
    },
  });

  function onSubmit(data: RepositoryFormData) {
    mutation.mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>

        <DialogHeader>
          <DialogTitle>Edit Repository</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >

          <div>
            <Label>Name</Label>

            <Input
              {...register("name", {
                required: "Repository name is required",
              })}
            />

            {errors.name && (
              <p className="text-red-500 text-sm">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label>Description</Label>

            <Input
              {...register("description")}
            />
          </div>

          <div>
            <Label>Language</Label>

            <Input
              {...register("language", {
                required: "Language is required",
              })}
            />

            {errors.language && (
              <p className="text-red-500 text-sm">
                {errors.language.message}
              </p>
            )}
          </div>

          <div>
            <Label>Visibility</Label>

            <select
              className="w-full rounded-md border p-2"
              {...register("visibility")}
            >
              <option value="Public">
                Public
              </option>

              <option value="Private">
                Private
              </option>
            </select>
          </div>

          <div>
            <Label>Status</Label>

            <select
              className="w-full rounded-md border p-2"
              {...register("status")}
            >
              <option value="Active">
                Active
              </option>

              <option value="Building">
                Building
              </option>

              <option value="Archived">
                Archived
              </option>
            </select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Updating..."
              : "Update Repository"}
          </Button>

        </form>

      </DialogContent>
    </Dialog>
  );
}