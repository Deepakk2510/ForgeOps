import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

import RepositoryHeader from "@/components/repositories/RepositoryHeader";
import RepositoryInfo from "@/components/repositories/RepositoryInfo";
import RepositoryAnalytics from "@/components/repositories/RepositoryAnalytics";
import READMECard from "@/components/repositories/READMECard";
import CodeExplorer from "@/components/repositories/CodeExplorer";

import { repositoryService } from "@/services/repository.service";

export default function RepositoryDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["repository", id],
    queryFn: () => repositoryService.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading repository...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        Failed to load repository.
      </div>
    );
  }

  const repository = data.data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <RepositoryHeader repository={repository} />

        <div className="flex gap-2">
          <Link
            to={`/repositories/${repository._id}/issues`}
          >
            <Button variant="outline">
              Issues ({repository.openIssues})
            </Button>
          </Link>

          <Link to={`/repositories/${repository._id}/pull-requests`}>
            <Button variant="outline">
              Pull Requests ({repository.pullRequests})
            </Button>
          </Link>

          <Link to={`/repositories/${repository._id}/version-control`}>
            <Button variant="outline">Branches</Button>
          </Link>

          <Link
            to={`/repositories/${repository._id}/settings`}
          >
            <Button variant="outline">
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Repository Information */}
      <RepositoryInfo repository={repository} />

      {/* Code Explorer & README */}
      <div className="grid gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-8">
          <CodeExplorer repositoryId={repository._id} />
          
          <READMECard
            repositoryId={repository._id}
            readme={repository.readme}
          />
        </div>
      </div>

      {/* Analytics */}
      <RepositoryAnalytics repository={repository} />
    </div>
  );
}
