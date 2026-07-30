import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Inbox, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { collaboratorService } from "@/services/collaborator.service";

export default function InvitationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["invitations"],
    queryFn: () => collaboratorService.getUserInvitations(),
  });

  const acceptMutation = useMutation({
    mutationFn: (inviteId: string) => collaboratorService.acceptInvitation(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      alert("Invitation accepted!");
    },
  });

  const declineMutation = useMutation({
    mutationFn: (inviteId: string) => collaboratorService.declineInvitation(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });

  const invitations = data || [];

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-8">
      <div className="flex items-center gap-3">
        <Inbox className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Invitations</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Repository Invites</CardTitle>
          <CardDescription>
            You have {invitations.length} pending {invitations.length === 1 ? "invitation" : "invitations"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : invitations.length === 0 ? (
            <p className="text-muted-foreground text-sm">You have no pending invitations.</p>
          ) : (
            <div className="space-y-4">
              {invitations.map((invite: any) => (
                <div key={invite._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-lg">
                      {invite.repository?.owner?.name} / {invite.repository?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Invited you as <strong>{invite.role}</strong>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        if (window.confirm("Decline this invitation?")) {
                          declineMutation.mutate(invite._id);
                        }
                      }}
                      disabled={declineMutation.isPending || acceptMutation.isPending}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                    <Button 
                      onClick={() => acceptMutation.mutate(invite._id)}
                      disabled={acceptMutation.isPending || declineMutation.isPending}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
