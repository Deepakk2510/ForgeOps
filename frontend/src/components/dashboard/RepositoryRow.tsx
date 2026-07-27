import {
  FolderGit2,
  Clock3,
  Star,
} from "lucide-react";

interface RepositoryRowProps {
  name: string;
  language: string;
  stars: number;
  lastCommit: string;
  status: "Active" | "Building" | "Archived";
}

export default function RepositoryRow({
  name,
  language,
  stars,
  lastCommit,
  status,
}: RepositoryRowProps) {
  const statusColor = {
    Active:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",

    Building:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",

    Archived:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  };

  return (
    <div className="flex items-center justify-between rounded-xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-muted/50 hover:shadow-lg">

      <div className="flex items-center gap-4">

        <div className="rounded-lg bg-primary/10 p-3">
          <FolderGit2 className="h-6 w-6 text-primary" />
        </div>

        <div>
          <h3 className="font-semibold">{name}</h3>

          <p className="text-sm text-muted-foreground">
            {language}
          </p>
        </div>

      </div>

      <div className="flex items-center gap-8">

        <div className="flex items-center gap-2 text-sm">
          <Star className="h-4 w-4" />
          {stars}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock3 className="h-4 w-4" />
          {lastCommit}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[status]}`}
        >
          {status}
        </span>

      </div>

    </div>
  );
}