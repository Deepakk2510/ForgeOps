import { useQuery } from "@tanstack/react-query";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentRepositories from "@/components/dashboard/RecentRepositories";
import BuildChart from "@/components/dashboard/BuildChart";
import LanguageChart from "@/components/dashboard/LanguageChart";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import CreateRepositoryDialog from "@/components/repositories/CreateRepositoryDialog";

import { dashboardService } from "@/services/dashboard.service";

import {
  FolderGit2,
  Globe,
  Lock,
  Star,
} from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-lg font-medium">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-red-500 text-lg">
        Failed to load dashboard.
      </div>
    );
  }

  const stats = [
    {
      title: "Repositories",
      value: String(data?.stats.repositories ?? 0),
      subtitle: "Total repositories",
      icon: FolderGit2,
    },
    {
      title: "Public",
      value: String(data?.stats.publicRepositories ?? 0),
      subtitle: "Visible to everyone",
      icon: Globe,
    },
    {
      title: "Private",
      value: String(data?.stats.privateRepositories ?? 0),
      subtitle: "Only you",
      icon: Lock,
    },
    {
      title: "Stars",
      value: String(data?.stats.stars ?? 0),
      subtitle: "Across repositories",
      icon: Star,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <DashboardHeader />
        <CreateRepositoryDialog />
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
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

      {/* Dashboard Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RecentRepositories />
          <BuildChart />
        </div>

        <div className="space-y-6">
          <LanguageChart />
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
}