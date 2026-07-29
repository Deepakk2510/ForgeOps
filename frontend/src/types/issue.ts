export interface Issue {
  _id: string;

  repository: string;

  creator: string;

  assignee?: string;

  title: string;

  description: string;

  status: "Open" | "In Progress" | "Closed";

  priority: "Low" | "Medium" | "High";

  labels: string[];

  createdAt: string;

  updatedAt: string;
}

export interface CreateIssuePayload {
  repository: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  labels: string[];
}