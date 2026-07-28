import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { useQuery } from "@tanstack/react-query";
import { repositoryService } from "@/services/repository.service";
import type { Repository } from "@/types/repository";

export default function BuildChart() {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["repositories"],
    queryFn: repositoryService.getAll,
  });

  const repositories: Repository[] = data?.data ?? [];

  // Group repositories by creation date
  const growthMap: Record<string, number> = {};

  repositories.forEach((repo) => {
    const date = new Date(repo.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

    growthMap[date] = (growthMap[date] || 0) + 1;
  });

  // Convert to chart data
  const chartData = Object.entries(growthMap)
    .map(([date, count]) => ({
      date,
      repositories: count,
    }))
    .sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return da - db;
    });

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
        <CardTitle>Repository Growth</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex h-72 items-center justify-center">
            Loading...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-muted-foreground">
            No repositories yet.
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="repositories"
                  stroke="#2563eb"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}