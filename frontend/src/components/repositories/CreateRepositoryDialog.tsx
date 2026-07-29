import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { repositoryService } from "@/services/repository.service";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RepositoryFormData {
  name: string;
  description: string;
  language: string;
  visibility: "Public" | "Private";
  status: "Active" | "Building" | "Archived";

  topics: string;
  license: string;
  website: string;
}

export default function CreateRepositoryDialog() {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RepositoryFormData>({
    defaultValues: {
      visibility: "Public",
      status: "Active",
      language: "",
      topics: "",
      license: "MIT",
      website: "",
    },
  });

  const mutation = useMutation({
    mutationFn: repositoryService.create,

    onSuccess: (data) => {
      console.log("✅ Repository Created:", data);

      toast.success("Repository created successfully!");

      queryClient.invalidateQueries({
        queryKey: ["repositories"],
      });

      reset();

      setOpen(false);
    },

    onError: (error: any) => {
      console.error("========== AXIOS ERROR ==========");
      console.error(error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

      toast.error(
        error.response?.data?.message ??
          "Failed to create repository."
      );
    },
  });

  const onSubmit = (data: RepositoryFormData) => {
    console.log("📤 Submitting:", data);

    mutation.mutate({
      ...data,
      topics: data.topics
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Repository</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Repository</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <Label>Repository Name</Label>

            <Input
              placeholder="ForgeOps"
              {...register("name", {
                required: "Repository name is required",
              })}
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label>Description</Label>

            <Input
              placeholder="Repository description"
              {...register("description")}
            />
          </div>

          <div>
            <Label>Language</Label>

            <Input
              placeholder="TypeScript"
              {...register("language", {
                required: "Language is required",
              })}
            />

            <div>
                <Label>Topics</Label>

                <Input
                     placeholder="react, typescript, mongodb"
                    {...register("topics")}
                />

                <p className="text-xs text-muted-foreground mt-1">
                    Separate topics with commas.
                </p>
            </div>

            <div>
              <Label>License</Label>

              <select
                className="w-full rounded-md border p-2"
                {...register("license")}
              >
                <option value="MIT">MIT</option>
                <option value="Apache-2.0">Apache 2.0</option>
                <option value="GPL-3.0">GPL 3.0</option>
                <option value="BSD-3-Clause">BSD 3-Clause</option>
                <option value="None">None</option>
              </select>
            </div>

            <div>
              <Label>Website</Label>

              <Input
                placeholder="https://example.com"
                {...register("website")}
              />
            </div>
            
            {errors.language && (
              <p className="text-red-500 text-sm mt-1">
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
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>

          <div>
            <Label>Status</Label>

            <select
              className="w-full rounded-md border p-2"
              {...register("status")}
            >
              <option value="Active">Active</option>
              <option value="Building">Building</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Creating..."
              : "Create Repository"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}