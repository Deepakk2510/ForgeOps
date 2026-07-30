import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { notificationService } from "@/services/notification.service";
import { Button } from "@/components/ui/button";

export function NotificationBell() {
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 60000, // Poll every minute
  });

  return (
    <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-white hover:bg-white/10" asChild>
      <Link to="/notifications">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Link>
    </Button>
  );
}
