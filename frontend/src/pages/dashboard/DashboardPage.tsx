import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentRepositories from "@/components/dashboard/RecentRepositories";
import BuildChart from "@/components/dashboard/BuildChart";
import LanguageChart from "@/components/dashboard/LanguageChart";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import CreateRepositoryDialog from "@/components/repositories/CreateRepositoryDialog";

import {
  FolderGit2,
  GitBranch,
  Bot,
  Rocket,
  Activity,
  HardDrive,
} from "lucide-react";

const stats = [
  {
    title: "Repositories",
    value: "12",
    subtitle: "+2 this week",
    icon: FolderGit2,
  },
  {
    title: "Builds",
    value: "146",
    subtitle: "98% Success",
    icon: GitBranch,
  },
  {
    title: "AI Chats",
    value: "35",
    subtitle: "8 Today",
    icon: Bot,
  },
  {
    title: "Deployments",
    value: "24",
    subtitle: "2 Running",
    icon: Rocket,
  },
  {
    title: "Pipeline Health",
    value: "99%",
    subtitle: "Excellent",
    icon: Activity,
  },
  {
    title: "Storage",
    value: "4.2 GB",
    subtitle: "Used",
    icon: HardDrive,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <DashboardHeader />
        <CreateRepositoryDialog />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Section */}
        <div className="space-y-6 lg:col-span-2">
          <RecentRepositories />
          <BuildChart />
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          <LanguageChart />
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
}