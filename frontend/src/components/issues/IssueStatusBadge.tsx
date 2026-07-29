import { Badge } from "@/components/ui/badge";

interface Props {
  status: "Open" | "In Progress" | "Closed";
}

export default function IssueStatusBadge({
  status,
}: Props) {
  switch (status) {
    case "Open":
      return (
        <Badge className="bg-green-600 hover:bg-green-700">
          Open
        </Badge>
      );

    case "In Progress":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          In Progress
        </Badge>
      );

    case "Closed":
      return (
        <Badge variant="secondary">
          Closed
        </Badge>
      );

    default:
      return <Badge>{status}</Badge>;
  }
}