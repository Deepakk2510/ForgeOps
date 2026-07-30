import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notificationService, type Notification } from "@/services/notification.service";

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getNotifications,
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your repositories and tasks.</p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={markAllAsReadMutation.isPending}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>Recent activity requiring your attention.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="text-muted-foreground text-sm">You have no notifications.</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification: Notification) => (
                <div
                  key={notification._id}
                  className={`flex items-start justify-between p-4 border rounded-lg transition-colors ${
                    !notification.isRead ? "bg-muted/50 border-primary/20" : "bg-card"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{notification.title}</span>
                      {!notification.isRead && (
                        <span className="flex h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                    {notification.link && (
                      <Link to={notification.link} className="text-primary hover:underline text-sm mt-2 block">
                        View Details
                      </Link>
                    )}
                  </div>

                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMarkAsRead(notification._id)}
                      disabled={markAsReadMutation.isPending}
                      title="Mark as read"
                    >
                      <Check className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
