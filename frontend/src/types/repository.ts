export interface Repository {
  _id: string;
  name: string;
  description: string;
  language: string;
  visibility: "Public" | "Private";
  stars: number;
  status: "Active" | "Building" | "Archived";
  createdAt: string;
  updatedAt: string;
}