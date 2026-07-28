export interface DashboardResponse {
  stats: {
    repositories: number;
    publicRepositories: number;
    privateRepositories: number;
    stars: number;
  };

  languages: Record<string, number>;

  recentRepositories: {
    _id: string;
    name: string;
    description: string;
    language: string;
    visibility: string;
    stars: number;
    status: string;
    createdAt: string;
  }[];

  latestRepository: any;
}