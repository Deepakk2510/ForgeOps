import {
  LayoutDashboard,
  FolderGit2,
  Bot,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      {/* Logo */}
      <div className="border-b p-6">
        <h1 className="text-2xl font-bold text-primary">
          ForgeOps
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition hover:bg-muted hover:text-primary"
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
            {initials}
          </div>

          <div className="overflow-hidden">
            <p className="truncate font-semibold">
              {user?.name}
            </p>

            <p className="truncate text-sm text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}