import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import RepositoryHeader from "@/components/repositories/RepositoryHeader";
import RepositoryInfo from "@/components/repositories/RepositoryInfo";
import RepositoryAnalytics from "@/components/repositories/RepositoryAnalytics";

import { repositoryService } from "@/services/repository.service";

export default function RepositoryDetailsPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["repository", id],
    queryFn: () => repositoryService.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        Loading repository...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-red-500">
        Failed to load repository.
      </div>
    );
  }

  const repository = data.data;

  return (
    <div className="space-y-8">
      <RepositoryHeader
        repository={repository}
      />

      <RepositoryInfo
        repository={repository}
      />

      <RepositoryAnalytics
        repository={repository}
      />
    </div>
  );
}