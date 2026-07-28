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

  const repositories: Repository[] = data?.data ?? [];

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
        {isLoading && (
          <p>Loading repositories...</p>
        )}

        {!isLoading && repositories.length === 0 && (
          <p className="text-muted-foreground">
            No repositories found.
          </p>
        )}

        {!isLoading &&
          repositories.map((repo) => (
            <RepositoryRow
              key={repo._id}
              repository={repo}
            />
          ))}
      </CardContent>
    </Card>
  );
}