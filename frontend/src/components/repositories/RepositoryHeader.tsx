import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { Repository } from "@/types/repository";

interface Props {
  repository: Repository;
}

export default function RepositoryHeader({
  repository,
}: Props) {
  return (
    <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {repository.name}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {repository.description || "No description provided."}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border px-4 py-2">
          <Star
            className={`h-5 w-5 ${
              repository.isStarred
                ? "fill-yellow-400 text-yellow-400"
                : ""
            }`}
          />

          <span className="font-semibold">
            {repository.stars}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary">
          {repository.language}
        </Badge>

        <Badge>
          {repository.visibility}
        </Badge>

        <Badge variant="outline">
          {repository.status}
        </Badge>
      </div>
    </div>
  );
}