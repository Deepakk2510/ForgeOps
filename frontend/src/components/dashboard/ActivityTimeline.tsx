import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { FolderGit2 } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { repositoryService } from "@/services/repository.service";
import type { Repository } from "@/types/repository";

function getTimeAgo(date: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );

  const intervals = [
    { label: "year", value: 31536000 },
    { label: "month", value: 2592000 },
    { label: "day", value: 86400 },
    { label: "hour", value: 3600 },
    { label: "minute", value: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.value);

    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
}

export default function ActivityTimeline() {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["repositories"],
    queryFn: repositoryService.getAll,
  });

  const repositories: Repository[] = [...(data?.data ?? [])]
    .sort(
      (a: Repository, b: Repository) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">
            Failed to load activity.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <p className="text-muted-foreground">
            Loading activity...
          </p>
        ) : repositories.length === 0 ? (
          <p className="text-muted-foreground">
            No recent activity.
          </p>
        ) : (
          repositories.map((repo) => (
            <div
              key={repo._id}
              className="flex items-start gap-4"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <FolderGit2 className="h-5 w-5 text-primary" />
              </div>

              <div>
                <p className="font-medium">
                  Repository{" "}
                  <span className="font-semibold">
                    {repo.name}
                  </span>{" "}
                  was created
                </p>

                <p className="text-sm text-muted-foreground">
                  {getTimeAgo(repo.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}