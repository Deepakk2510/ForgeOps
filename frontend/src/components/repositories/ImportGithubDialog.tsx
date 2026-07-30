import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { repositoryService } from "@/services/repository.service";
import type { GithubRepository } from "@/services/repository.service";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export default function ImportGithubDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["github-repositories"],
    queryFn: repositoryService.getGithubRepositories,
    enabled: open, // Only fetch when dialog is open
    retry: false,
  });

  const importMutation = useMutation({
    mutationFn: repositoryService.create,
    onSuccess: () => {
      toast.success("Repository imported successfully!");
      queryClient.invalidateQueries({ queryKey: ["repositories"] });
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ?? "Failed to import repository."
      );
    },
  });

  const handleImport = (repo: GithubRepository) => {
    importMutation.mutate({
      name: repo.name,
      description: repo.description,
      language: repo.language || "Unknown",
      visibility: repo.visibility,
      status: "Active",
      topics: [],
      license: "MIT",
      website: repo.html_url,
    });
  };

  const githubRepos = data?.data ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          Import from GitHub
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import GitHub Repository</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-4 mt-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p>Failed to load repositories.</p>
              <p className="text-sm mt-2 text-muted-foreground">
                {(error as any)?.response?.data?.message || "Ensure you are logged in with GitHub."}
              </p>
            </div>
          ) : githubRepos.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No repositories found on your GitHub account.
            </p>
          ) : (
            <div className="grid gap-3">
              {githubRepos.map((repo) => (
                <div
                  key={repo.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{repo.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border bg-muted text-muted-foreground">
                        {repo.visibility}
                      </span>
                    </div>
                    {repo.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {repo.description}
                      </p>
                    )}
                    {repo.language && (
                      <p className="text-xs font-medium text-primary">
                        {repo.language}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleImport(repo)}
                    disabled={importMutation.isPending}
                  >
                    Import
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
