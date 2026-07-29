import {
  Clock3,
  GitCommit,
} from "lucide-react";

export default function RepositoryTimeline() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="mb-6 text-xl font-semibold">
        Activity Timeline
      </h2>

      <div className="space-y-6">

        <div className="flex gap-4">
          <GitCommit className="h-5 w-5 text-primary" />

          <div>
            <p className="font-medium">
              Initial Repository Created
            </p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              Today
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}