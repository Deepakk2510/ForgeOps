import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { repositoryService } from "@/services/repository.service";

interface Props {
  repositoryId: string;
  readme: string;
}

interface FormData {
  readme: string;
}

export default function EditReadmeDialog({
  repositoryId,
  readme,
}: Props) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      readme,
    },
  });

  useEffect(() => {
    reset({ readme });
  }, [readme, reset]);

  const markdown = watch("readme");

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      repositoryService.updateReadme(
        repositoryId,
        data.readme
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["repository", repositoryId],
      });

      setOpen(false);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Edit README
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>
            Edit README.md
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Editor */}
            <div>
              <h3 className="mb-3 font-semibold">
                Markdown Editor
              </h3>

              <Textarea
                rows={22}
                placeholder="# My Repository"
                {...register("readme")}
              />
            </div>

            {/* Preview */}
            <div>
              <h3 className="mb-3 font-semibold">
                Live Preview
              </h3>

              <div className="prose dark:prose-invert max-w-none min-h-132.5 rounded-lg border p-5 overflow-auto">
                {markdown?.trim() ? (
                  <ReactMarkdown>
                    {markdown}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground">
                    Preview will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? "Saving..."
                : "Save README"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}