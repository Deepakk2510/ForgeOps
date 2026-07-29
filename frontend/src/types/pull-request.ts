export type PullRequestStatus = "Open" | "Merged" | "Closed";
export type MergeStatus = "Pending" | "Approved" | "Rejected";
export type ReviewStatus = "Approved" | "Changes Requested";

export interface PullRequestReview {
  _id: string;
  reviewer: { _id: string; name: string; email: string } | string;
  status: ReviewStatus;
  comment: string;
  createdAt: string;
}

export interface PullRequest {
  _id: string;
  repository: string;
  creator: { _id: string; name: string; email: string } | string;
  title: string;
  description: string;
  reviewers: Array<{ _id: string; name: string; email: string } | string>;
  status: PullRequestStatus;
  mergeStatus: MergeStatus;
  sourceBranch: string;
  targetBranch: string;
  changedFiles: number;
  commits: number;
  reviews: PullRequestReview[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePullRequestPayload {
  repository: string;
  title: string;
  description: string;
  reviewers: string[];
  sourceBranch: string;
  targetBranch: string;
  changedFiles: number;
  commits: number;
}
