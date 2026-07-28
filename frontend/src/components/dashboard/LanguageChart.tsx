import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import { useQuery } from "@tanstack/react-query";
import { repositoryService } from "@/services/repository.service";
import type { Repository } from "@/types/repository";

const COLORS = [
  "#2563eb",
  "#22c55e",
  "#f97316",
  "#eab308",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#ef4444",
];

export default function LanguageChart() {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["repositories"],
    queryFn: repositoryService.getAll,
  });

  const repositories: Repository[] = data?.data ?? [];

  const languageMap: Record<string, number> = {};

  repositories.forEach((repo) => {
    if (!repo.language) return;

    languageMap[repo.language] =
      (languageMap[repo.language] || 0) + 1;
  });

  const chartData = Object.entries(languageMap).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">
            Failed to load chart.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle>Repository Languages</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-72 items-center justify-center">
            Loading...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-muted-foreground">
            No repositories found.
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index % COLORS.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}