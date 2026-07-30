import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Webhook, Activity } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { webhookService, type Webhook as IWebhook } from "@/services/webhook.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WebhooksSettingsProps {
  repositoryId: string;
}

export function WebhooksSettings({ repositoryId }: WebhooksSettingsProps) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [payloadUrl, setPayloadUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [events] = useState<string[]>(["push", "pull_request", "issue"]);

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ["webhooks", repositoryId],
    queryFn: () => webhookService.getWebhooks(repositoryId),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<IWebhook, "_id" | "repository">) =>
      webhookService.createWebhook(repositoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks", repositoryId] });
      setIsDialogOpen(false);
      setPayloadUrl("");
      setSecret("");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<IWebhook, "_id" | "repository"> }) =>
      webhookService.updateWebhook(repositoryId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks", repositoryId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => webhookService.deleteWebhook(repositoryId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks", repositoryId] });
    },
  });

  const handleCreate = () => {
    if (!payloadUrl) return;
    createMutation.mutate({ payloadUrl, secret, events, isActive: true });
  };

  const handleToggle = (webhook: IWebhook) => {
    updateMutation.mutate({
      id: webhook._id,
      data: {
        payloadUrl: webhook.payloadUrl,
        secret: webhook.secret,
        events: webhook.events,
        isActive: !webhook.isActive,
      },
    });
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading webhooks...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Webhooks</h3>
          <p className="text-sm text-muted-foreground">
            Webhooks allow external services to be notified when certain events happen.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Webhook</DialogTitle>
              <DialogDescription>
                Configure an external URL to receive payload events.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Payload URL *</label>
                <Input
                  placeholder="https://example.com/webhook"
                  value={payloadUrl}
                  onChange={(e) => setPayloadUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Secret</label>
                <Input
                  placeholder="Optional secret token"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Events</label>
                <div className="text-sm text-muted-foreground">
                  By default, this will trigger on Push, Pull Request, and Issue events.
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!payloadUrl || createMutation.isPending}>
                {createMutation.isPending ? "Adding..." : "Add Webhook"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {webhooks.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          <Webhook className="mx-auto mb-4 h-8 w-8 opacity-50" />
          <p>No webhooks configured.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <div
              key={webhook._id}
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-full ${
                    webhook.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted"
                  }`}
                >
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium font-mono text-sm break-all">{webhook.payloadUrl}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Triggers on: {webhook.events.join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <Switch
                    checked={webhook.isActive}
                    onCheckedChange={() => handleToggle(webhook)}
                    disabled={updateMutation.isPending}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => deleteMutation.mutate(webhook._id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
