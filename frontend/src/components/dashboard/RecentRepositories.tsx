import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import RepositoryRow from "./RepositoryRow";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderGit2 } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { repositoryService } from "@/services/repository.service";

import type { Repository } from "@/types/repository";

export default function RecentRepositories() {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["repositories"],
    queryFn: repositoryService.getAll,
  });

  const repositories: Repository[] = (data?.data ?? [])
    .sort(
      (a : Repository, b : Repository) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">
            Failed to load repositories.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Repositories</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : repositories.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FolderGit2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No repositories yet</p>
              <p className="text-sm text-muted-foreground">
                You haven't created any repositories.
              </p>
            </div>
          </div>
        ) : (
          repositories.map((repo) => (
            <RepositoryRow
              key={repo._id}
              repository={repo}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}