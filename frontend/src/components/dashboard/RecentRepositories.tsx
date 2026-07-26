import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import RepositoryRow from "./RepositoryRow";

const repositories = [
  {
    name: "ForgeOps",
    language: "TypeScript",
    stars: 156,
    lastCommit: "2 mins ago",
    status: "Healthy" as const,
  },
  {
    name: "helPG",
    language: "React",
    stars: 48,
    lastCommit: "Yesterday",
    status: "Active" as const,
  },
  {
    name: "Portfolio",
    language: "Next.js",
    stars: 31,
    lastCommit: "3 days ago",
    status: "Pending" as const,
  },
];

export default function RecentRepositories() {
  return (
    <Card>

      <CardHeader>
        <CardTitle>
          Recent Repositories
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {repositories.map((repo) => (
          <RepositoryRow
            key={repo.name}
            {...repo}
          />
        ))}

      </CardContent>

    </Card>
  );
}