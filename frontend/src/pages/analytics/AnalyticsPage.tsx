import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, GitCommit, Users, Clock } from "lucide-react";

export default function AnalyticsPage() {
  const stats = [
    { title: "Total Commits", value: "8,234", icon: GitCommit, trend: "+12%" },
    { title: "Active Contributors", value: "24", icon: Users, trend: "+2" },
    { title: "Deploy Frequency", value: "4.5/day", icon: Activity, trend: "+1.2" },
    { title: "Avg Review Time", value: "2h 15m", icon: Clock, trend: "-30m" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your team's velocity and code health metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend.startsWith("+") || stat.trend.startsWith("-30"); // just mocking green color
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 min-h-[300px] flex items-center justify-center bg-muted/20 border-dashed border-2">
          <p className="text-muted-foreground">Code Churn Chart Placeholder</p>
        </Card>
        <Card className="col-span-1 min-h-[300px] flex items-center justify-center bg-muted/20 border-dashed border-2">
          <p className="text-muted-foreground">Language Distribution Chart Placeholder</p>
        </Card>
      </div>
    </div>
  );
}
