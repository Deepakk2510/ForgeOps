import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { issueService } from "@/services/issue.service";

interface Props {
  repositoryId: string;
  onCreated: () => void;
}

export default function CreateIssueDialog({
  repositoryId,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const createIssue = async () => {
    if (!title.trim()) return;

    await issueService.create({
      repository: repositoryId,
      title,
      description,
      priority: "Medium",
      labels: [],
    });

    setTitle("");
    setDescription("");

    onCreated();
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h2 className="text-lg font-semibold">
        Create Issue
      </h2>

      <Input
        placeholder="Issue title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <Textarea
        placeholder="Describe the issue..."
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <Button onClick={createIssue}>
        Create Issue
      </Button>
    </div>
  );
}