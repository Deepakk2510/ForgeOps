import {
  LayoutDashboard,
  FolderGit2,
  Bot,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Repositories",
    icon: FolderGit2,
  },
  {
    title: "AI Chat",
    icon: Bot,
  },
  {
    title: "Reports",
    icon: FileText,
  },
  {
    title: "Analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          ForgeOps
        </h1>
      </div>

      <nav className="px-3">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition hover:bg-muted"
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}