import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Bot,
  GitBranch,
  ShieldCheck,
  Rocket,
} from "lucide-react";

const activities = [
  {
    id: 1,
    icon: Bot,
    title: "AI reviewed Pull Request #42",
    time: "5 mins ago",
  },
  {
    id: 2,
    icon: Rocket,
    title: "Deployment completed successfully",
    time: "20 mins ago",
  },
  {
    id: 3,
    icon: GitBranch,
    title: "Repository synced with GitHub",
    time: "1 hour ago",
  },
  {
    id: 4,
    icon: ShieldCheck,
    title: "Security scan completed",
    time: "Yesterday",
  },
];

export default function ActivityTimeline() {
  return (
    <Card className="transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>

              <div>
                <p className="font-medium">
                  {activity.title}
                </p>

                <p className="text-sm text-muted-foreground">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}