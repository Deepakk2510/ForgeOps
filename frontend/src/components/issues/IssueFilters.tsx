import { Input } from "@/components/ui/input";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function IssueFilters({
  search,
  setSearch,
}: Props) {
  return (
    <Input
      placeholder="Search issues..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
    />
  );
}