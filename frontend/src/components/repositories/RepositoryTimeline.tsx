import {
  Clock3,
  GitCommit,
  FileText,
  Star,
  Rocket,
} from "lucide-react";

import type { Repository } from "@/types/repository";

interface Props {
  repository: Repository;
}

export default function RepositoryTimeline({
  repository,
}: Props) {
  const events = [
    {
      title: "Repository Created",
      description: new Date(
        repository.createdAt
      ).toLocaleDateString(),
      icon: Rocket,
    },
    {
      title: "Last Commit",
      description:
        repository.lastCommitMessage ||
        "Initial commit",
      icon: GitCommit,
    },
    {
      title: "README Updated",
      description:
        repository.readme
          ? "README available"
          : "README not added",
      icon: FileText,
    },
    {
      title: "Repository Stars",
      description: `${repository.stars} Stars`,
      icon: Star,
    },
    {
      title: "Last Updated",
      description: new Date(
        repository.updatedAt
      ).toLocaleDateString(),
      icon: Clock3,
    },
  ];

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Activity Timeline
      </h2>

      <div className="space-y-6">
        {events.map((event, index) => {
          const Icon = event.icon;

          return (
            <div
              key={event.title}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-muted p-2">
                  <Icon className="h-5 w-5" />
                </div>

                {index !== events.length - 1 && (
                  <div className="mt-2 h-full w-px bg-border" />
                )}
              </div>

              <div className="pb-4">
                <p className="font-medium">
                  {event.title}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}