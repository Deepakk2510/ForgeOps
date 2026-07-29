import {
  Star,
  Lock,
  Globe,
  Code2,
} from "lucide-react";

import type { Repository } from "@/types/repository";

interface Props {
  repository: Repository;
}

export default function RepositoryStats({
  repository,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-4">

      <div className="rounded-xl border p-5">
        <Star className="mb-3 h-6 w-6 text-yellow-500" />
        <p className="text-sm text-muted-foreground">
          Stars
        </p>
        <h3 className="text-2xl font-bold">
          {repository.stars}
        </h3>
      </div>

      <div className="rounded-xl border p-5">
        {repository.visibility === "Public" ? (
          <Globe className="mb-3 h-6 w-6" />
        ) : (
          <Lock className="mb-3 h-6 w-6" />
        )}

        <p className="text-sm text-muted-foreground">
          Visibility
        </p>

        <h3 className="text-xl font-bold">
          {repository.visibility}
        </h3>
      </div>

      <div className="rounded-xl border p-5">
        <Code2 className="mb-3 h-6 w-6" />

        <p className="text-sm text-muted-foreground">
          Language
        </p>

        <h3 className="text-xl font-bold">
          {repository.language}
        </h3>
      </div>

      <div className="rounded-xl border p-5">
        <p className="text-sm text-muted-foreground">
          Status
        </p>

        <h3 className="text-xl font-bold">
          {repository.status}
        </h3>
      </div>

    </div>
  );
}