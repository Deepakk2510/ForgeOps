import { CalendarDays } from "lucide-react";

export default function DashboardHeader() {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Welcome back, Deepak 👋
        </p>

        <p className="text-sm text-muted-foreground">
          Monitor repositories, AI suggestions and deployments.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-lg border px-4 py-2">
        <CalendarDays className="h-5 w-5" />

        <div>
          <p className="text-xs text-muted-foreground">
            Today
          </p>

          <p className="text-sm font-medium">
            {formattedDate}
          </p>
        </div>
      </div>
    </div>
  );
}