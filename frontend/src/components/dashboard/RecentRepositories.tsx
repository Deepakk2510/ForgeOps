import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import RepositoryRow from "./RepositoryRow";

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
          <p className="text-muted-foreground">
            Loading repositories...
          </p>
        ) : repositories.length === 0 ? (
          <p className="text-muted-foreground">
            No repositories found.
          </p>
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