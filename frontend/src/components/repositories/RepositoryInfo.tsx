import {
  CalendarDays,
  Globe,
  GitBranch,
  ShieldCheck,
  AlertCircle,
  GitPullRequest,
  FileCode2,
  Activity,
} from "lucide-react";

import type { Repository } from "@/types/repository";

interface Props {
  repository: Repository;
}

export default function RepositoryInfo({
  repository,
}: Props) {
  const infoItems = [
    {
      icon: <FileCode2 className="h-5 w-5" />,
      label: "Language",
      value: repository.language,
    },
    {
      icon: <GitBranch className="h-5 w-5" />,
      label: "Default Branch",
      value: repository.defaultBranch,
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      label: "Visibility",
      value: repository.visibility,
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: "Status",
      value: repository.status,
    },
    {
      icon: <AlertCircle className="h-5 w-5" />,
      label: "Open Issues",
      value: repository.openIssues,
    },
    {
      icon: <GitPullRequest className="h-5 w-5" />,
      label: "Pull Requests",
      value: repository.pullRequests,
    },
    {
      icon: <CalendarDays className="h-5 w-5" />,
      label: "Created",
      value: new Date(
        repository.createdAt
      ).toLocaleDateString(),
    },
    {
      icon: <CalendarDays className="h-5 w-5" />,
      label: "Last Updated",
      value: new Date(
        repository.updatedAt
      ).toLocaleDateString(),
    },
    {
      icon: <CalendarDays className="h-5 w-5" />,
      label: "Last Commit",
      value: new Date(
        repository.lastCommitAt
      ).toLocaleDateString(),
    },
  ];

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Repository Information
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-3 rounded-lg border p-4"
          >
            <div className="mt-1 text-muted-foreground">
              {item.icon}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {item.label}
              </p>

              <p className="font-medium break-all">
                {item.value}
              </p>
            </div>
          </div>
        ))}

        {repository.website && (
          <div className="flex items-start gap-3 rounded-lg border p-4 md:col-span-2">
            <Globe className="mt-1 h-5 w-5 text-muted-foreground" />

            <div>
              <p className="text-sm text-muted-foreground">
                Website
              </p>

              <a
                href={repository.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline break-all"
              >
                {repository.website}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}