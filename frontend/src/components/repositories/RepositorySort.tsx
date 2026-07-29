import type { SortOption } from "@/types/repositoryFilters";

interface Props {
  sort: SortOption;

  setSort: (
    value: SortOption
  ) => void;
}

export default function RepositorySort({
  sort,
  setSort,
}: Props) {
  return (
    <select
      value={sort}
      onChange={(e) =>
        setSort(
          e.target.value as SortOption
        )
      }
      className="rounded-lg border p-2"
    >
      <option>Newest</option>
      <option>Oldest</option>
      <option>Stars</option>
      <option>A-Z</option>
      <option>Z-A</option>
    </select>
  );
}