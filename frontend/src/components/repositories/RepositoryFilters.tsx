import type {
  VisibilityFilter,
  StatusFilter,
} from "@/types/repositoryFilters";

interface Props {
  language: string;
  visibility: VisibilityFilter;
  status: StatusFilter;

  languages: string[];

  setLanguage: (value: string) => void;
  setVisibility: (
    value: VisibilityFilter
  ) => void;
  setStatus: (
    value: StatusFilter
  ) => void;
}

export default function RepositoryFilters({
  language,
  visibility,
  status,
  languages,
  setLanguage,
  setVisibility,
  setStatus,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <select
        value={language}
        onChange={(e) =>
          setLanguage(e.target.value)
        }
        className="rounded-lg border p-2"
      >
        <option>All</option>

        {languages.map((lang) => (
          <option key={lang}>{lang}</option>
        ))}
      </select>

      <select
        value={visibility}
        onChange={(e) =>
          setVisibility(
            e.target.value as VisibilityFilter
          )
        }
        className="rounded-lg border p-2"
      >
        <option>All</option>
        <option>Public</option>
        <option>Private</option>
      </select>

      <select
        value={status}
        onChange={(e) =>
          setStatus(
            e.target.value as StatusFilter
          )
        }
        className="rounded-lg border p-2"
      >
        <option>All</option>
        <option>Active</option>
        <option>Building</option>
        <option>Archived</option>
      </select>
    </div>
  );
}