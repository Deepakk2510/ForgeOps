export interface Repository {
  name: string;
  owner: string;
  description: string;
}

export interface ChatRequest {
  repo_name: string;
  question: string;
}