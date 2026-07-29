import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CreateRepositoryDialog from "@/components/repositories/CreateRepositoryDialog";
import RepositoryExplorer from "@/components/repositories/RepositoryExplorer";

export default function RepositoriesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <DashboardHeader
          title="Repositories"
          subtitle="Create, manage and organize your repositories."
        />

        <CreateRepositoryDialog />
      </div>

      <RepositoryExplorer />
    </div>
  );
}