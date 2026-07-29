import type { Repository } from "@/types/repository";

import RepositoryStats from "./RepositoryStats";
import RepositoryGrowthChart from "./RepositoryGrowthChart";
import RepositoryTimeline from "./RepositoryTimeline";

interface Props {
  repository: Repository;
}

export default function RepositoryAnalytics({
  repository,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Statistics */}
      <RepositoryStats repository={repository} />

      {/* Charts */}
      <div className="grid gap-8 lg:grid-cols-2">
        <RepositoryGrowthChart />

        <RepositoryTimeline repository = {repository}/>
      </div>

      {/* Future Analytics */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Upcoming Analytics
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border p-5 transition hover:shadow-md">
            <h3 className="font-semibold">
              ⭐ Star History
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Daily and monthly star growth over time.
            </p>
          </div>

          <div className="rounded-lg border p-5 transition hover:shadow-md">
            <h3 className="font-semibold">
              🔥 Commit Heatmap
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              GitHub-style yearly contribution heatmap.
            </p>
          </div>

          <div className="rounded-lg border p-5 transition hover:shadow-md">
            <h3 className="font-semibold">
              📈 Activity Trends
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Weekly repository activity and commits.
            </p>
          </div>

          <div className="rounded-lg border p-5 transition hover:shadow-md">
            <h3 className="font-semibold">
              💻 Language Insights
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Language usage statistics and distribution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}