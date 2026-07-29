import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";

import { Search } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { repositoryService } from "@/services/repository.service";

import type { Repository } from "@/types/repository";

import type {
  VisibilityFilter,
  StatusFilter,
  SortOption,
} from "@/types/repositoryFilters";

import RepositoryRow from "@/components/dashboard/RepositoryRow";
import RepositoryFilters from "./RepositoryFilters";
import RepositorySort from "./RepositorySort";

export default function RepositoryExplorer() {
  const [search, setSearch] = useState("");

  const [language, setLanguage] =
    useState("All");

  const [visibility, setVisibility] =
    useState<VisibilityFilter>("All");

  const [status, setStatus] =
    useState<StatusFilter>("All");

  const [sort, setSort] =
    useState<SortOption>("Newest");

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["repositories"],
    queryFn: repositoryService.getAll,
  });

  const repositories: Repository[] =
    data?.data ?? [];

  const languages = useMemo(() => {
    return Array.from(
      new Set(
        repositories
          .map((repo) => repo.language)
          .filter(Boolean)
      )
    ).sort();
  }, [repositories]);

  const filteredRepositories = useMemo(() => {
    let result = [...repositories];

    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter((repo) => {
        return (
          repo.name
            .toLowerCase()
            .includes(q) ||
          repo.description
            .toLowerCase()
            .includes(q) ||
          repo.language
            .toLowerCase()
            .includes(q)
        );
      });
    }

    if (language !== "All") {
      result = result.filter(
        (repo) =>
          repo.language === language
      );
    }

    if (visibility !== "All") {
      result = result.filter(
        (repo) =>
          repo.visibility === visibility
      );
    }

    if (status !== "All") {
      result = result.filter(
        (repo) =>
          repo.status === status
      );
    }

    switch (sort) {
      case "Newest":
        result.sort(
          (
            a: Repository,
            b: Repository
          ) =>
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
        );
        break;

      case "Oldest":
        result.sort(
          (
            a: Repository,
            b: Repository
          ) =>
            new Date(
              a.createdAt
            ).getTime() -
            new Date(
              b.createdAt
            ).getTime()
        );
        break;

      case "Stars":
        result.sort(
          (
            a: Repository,
            b: Repository
          ) => b.stars - a.stars
        );
        break;

      case "A-Z":
        result.sort(
          (
            a: Repository,
            b: Repository
          ) =>
            a.name.localeCompare(
              b.name
            )
        );
        break;

      case "Z-A":
        result.sort(
          (
            a: Repository,
            b: Repository
          ) =>
            b.name.localeCompare(
              a.name
            )
        );
        break;
    }

    return result;
  }, [
    repositories,
    search,
    language,
    visibility,
    status,
    sort,
  ]);

  return (
    <div className="space-y-6">
      {/* Search */}

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />

        <Input
          placeholder="Search repositories..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="pl-10"
        />
      </div>

      {/* Filters */}

      <div className="grid gap-4 lg:grid-cols-4">
        <RepositoryFilters
          language={language}
          visibility={visibility}
          status={status}
          languages={languages}
          setLanguage={setLanguage}
          setVisibility={setVisibility}
          setStatus={setStatus}
        />

        <RepositorySort
          sort={sort}
          setSort={setSort}
        />
      </div>

      {/* Repository List */}

      {isLoading ? (
        <p>Loading repositories...</p>
      ) : error ? (
        <p className="text-red-500">
          Failed to load repositories.
        </p>
      ) : filteredRepositories.length ===
        0 ? (
        <p className="text-muted-foreground">
          No repositories found.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredRepositories.map(
            (repo) => (
              <RepositoryRow
                key={repo._id}
                repository={repo}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}