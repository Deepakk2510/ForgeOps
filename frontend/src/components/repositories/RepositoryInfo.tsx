import type { Repository } from "@/types/repository";

interface Props {
  repository: Repository;
}

export default function RepositoryInfo({
  repository,
}: Props) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-semibold">
        Repository Information
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">
            Language
          </p>

          <p className="font-medium">
            {repository.language}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Visibility
          </p>

          <p className="font-medium">
            {repository.visibility}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Status
          </p>

          <p className="font-medium">
            {repository.status}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Stars
          </p>

          <p className="font-medium">
            {repository.stars}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Created
          </p>

          <p className="font-medium">
            {new Date(repository.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Last Updated
          </p>

          <p className="font-medium">
            {new Date(repository.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}