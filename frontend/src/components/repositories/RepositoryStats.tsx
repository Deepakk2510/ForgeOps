import {
  Star,
  GitFork,
  AlertCircle,
  GitPullRequest,
  GitBranch,
  Activity,
} from "lucide-react";

import type { Repository } from "@/types/repository";

interface Props {
  repository: Repository;
}

export default function RepositoryStats({
  repository,
}: Props) {
  const stats = [
    {
      title: "Stars",
      value: repository.stars,
      icon: Star,
    },
    {
      title: "Forks",
      value: repository.forks,
      icon: GitFork,
    },
    {
      title: "Open Issues",
      value: repository.openIssues,
      icon: AlertCircle,
    },
    {
      title: "Pull Requests",
      value: repository.pullRequests,
      icon: GitPullRequest,
    },
    {
      title: "Default Branch",
      value: repository.defaultBranch,
      icon: GitBranch,
    },
    {
      title: "Status",
      value: repository.status,
      icon: Activity,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {stat.value}
                </h3>
              </div>

              <div className="rounded-full bg-muted p-3">
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}