import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import RepositoryRow from "./RepositoryRow";

import { useEffect, useState } from "react";
import { repositoryService } from "@/services/repository.service";
import type { Repository } from "@/types/repository";

export default function RecentRepositories() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepositories() {
      try {
        const response = await repositoryService.getAll();
        setRepositories(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchRepositories();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Repositories</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {loading && (
          <p>Loading repositories...</p>
        )}

        {!loading && repositories.length === 0 && (
          <p className="text-muted-foreground">
            No repositories found.
          </p>
        )}

        {!loading &&
          repositories.map((repo) => (
            <RepositoryRow
              key={repo._id}
              name={repo.name}
              language={repo.language}
              stars={repo.stars}
              status={repo.status}
              lastCommit="Just now"
            />
          ))}
      </CardContent>
    </Card>
  );
}