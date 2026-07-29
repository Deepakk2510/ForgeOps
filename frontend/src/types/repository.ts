export interface Repository {
  _id: string;

  name: string;

  description: string;

  language: string;

  visibility: "Public" | "Private";

  stars: number;

  isStarred: boolean;

  status: "Active" | "Building" | "Archived";

  createdAt: string;

  updatedAt: string;

  readme: string;

  topics: string[];

  defaultBranch: string;

  license: string;

  website: string;

  forks: number;

  openIssues: number;

  pullRequests: number;

  lastCommitMessage: string;

  lastCommitAt: string;
}