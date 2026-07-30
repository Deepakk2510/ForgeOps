import { Search, UserCircle2, Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-8">
      {/* Left */}
      <div className="relative w-96">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />

        <input
          type="text"
          placeholder="Search repositories..."
          className="h-10 w-full rounded-lg border bg-background pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Right */}

      <div className="flex items-center gap-5">
        <ThemeToggle />

        <Link to="/invitations" className="hover:text-primary transition-colors">
          <Inbox size={20} />
        </Link>

        <NotificationBell />

        <button>
          <UserCircle2 size={28} />
        </button>
      </div>
    </header>
  );
}