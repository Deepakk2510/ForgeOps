import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, Shield, ShieldAlert, ShieldCheck, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { collaboratorService, type Collaborator } from "@/services/collaborator.service";

interface CollaboratorsSettingsProps {
  repositoryId: string;
}

export default function CollaboratorsSettings({ repositoryId }: CollaboratorsSettingsProps) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Read");

  const { data, isLoading } = useQuery({
    queryKey: ["collaborators", repositoryId],
    queryFn: () => collaboratorService.getCollaborators(repositoryId),
  });

  const inviteMutation = useMutation({
    mutationFn: () => collaboratorService.addCollaborator(repositoryId, email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborators", repositoryId] });
      setEmail("");
      setRole("Read");
      alert("Invitation sent!");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to invite collaborator");
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ collabId, newRole }: { collabId: string; newRole: string }) =>
      collaboratorService.updateRole(repositoryId, collabId, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborators", repositoryId] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to update role");
    }
  });

  const removeMutation = useMutation({
    mutationFn: (collabId: string) => collaboratorService.removeCollaborator(repositoryId, collabId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborators", repositoryId] });
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to remove collaborator");
    }
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    inviteMutation.mutate();
  };

  const collaborators = data || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invite Collaborator</CardTitle>
          <CardDescription>
            Add users to this repository by their email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="flex gap-4 items-end">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 w-48">
              <label className="text-sm font-medium">Role</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Write">Write</SelectItem>
                  <SelectItem value="Read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={inviteMutation.isPending || !email}>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Access</CardTitle>
          <CardDescription>
            {collaborators.length} {collaborators.length === 1 ? "collaborator" : "collaborators"} have access to this repository.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : collaborators.length === 0 ? (
            <p className="text-muted-foreground text-sm">No collaborators found.</p>
          ) : (
            <div className="space-y-4">
              {collaborators.map((collab: Collaborator) => (
                <div key={collab._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-muted rounded-full">
                      {collab.role === "Admin" ? <ShieldAlert className="w-5 h-5" /> : collab.role === "Write" ? <ShieldCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{collab.user.name}</p>
                      <p className="text-sm text-muted-foreground">{collab.user.email}</p>
                    </div>
                    {collab.status === "Pending" && (
                      <Badge variant="secondary">Pending Invite</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Select
                      value={collab.role}
                      onValueChange={(val) => updateRoleMutation.mutate({ collabId: collab._id, newRole: val })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Write">Write</SelectItem>
                        <SelectItem value="Read">Read</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to remove this collaborator?")) {
                          removeMutation.mutate(collab._id);
                        }
                      }}
                    >
                      <X className="w-4 h-4" />
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
