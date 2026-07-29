import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { issueService } from "@/services/issue.service";

import IssueCard from "@/components/issues/IssueCard";
import IssueFilters from "@/components/issues/IssueFilters";
import CreateIssueDialog from "@/components/issues/CreateIssueDialog";
import IssueDetailsDialog from "@/components/issues/IssueDetailsDialog";

import type { Issue } from "@/types/issue";

export default function IssuesPage() {
  const { repositoryId } = useParams<{
    repositoryId: string;
  }>();

  const [search, setSearch] = useState("");
  const [selectedIssue, setSelectedIssue] =
    useState<Issue | null>(null);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["issues", repositoryId],
    queryFn: () =>
      issueService.getRepositoryIssues(repositoryId!),
    enabled: !!repositoryId,
  });

  const issues = useMemo(() => {
    if (!data) return [];

    return data.data.filter((issue) =>
      issue.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading Issues...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        Failed to load issues.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Repository Issues
          </h1>

          <p className="text-muted-foreground">
            Track bugs, feature requests and improvements.
          </p>
        </div>

        <CreateIssueDialog
          repositoryId={repositoryId!}
          onCreated={refetch}
        />
      </div>

      <IssueFilters
        search={search}
        setSearch={setSearch}
      />

      {issues.length === 0 ? (
        <div className="rounded-lg border py-16 text-center">
          <h2 className="text-xl font-semibold">
            No Issues
          </h2>

          <p className="mt-2 text-muted-foreground">
            Create your first issue to start tracking work.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div
              key={issue._id}
              onClick={() => setSelectedIssue(issue)}
              className="cursor-pointer"
            >
              <IssueCard issue={issue} />
            </div>
          ))}
        </div>
      )}

      <IssueDetailsDialog
        issue={selectedIssue}
        open={!!selectedIssue}
        onOpenChange={(open) => {
          if (!open) setSelectedIssue(null);
        }}
        onUpdated={() => {
          refetch();
        }}
      />
    </div>
  );
}