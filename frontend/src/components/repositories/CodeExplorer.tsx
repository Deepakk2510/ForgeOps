import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fileService } from "@/services/file.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Folder, FileCode, ChevronRight } from "lucide-react";
import FileViewer from "./FileViewer";

interface CodeExplorerProps {
  repositoryId: string;
}

export default function CodeExplorer({ repositoryId }: CodeExplorerProps) {
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const { data: files, isLoading, error } = useQuery({
    queryKey: ["files", repositoryId, currentPath],
    queryFn: () => fileService.getFiles(repositoryId, undefined, currentPath),
  });

  const handleNavigate = (newPath: string) => {
    setCurrentPath(newPath);
    setSelectedFileId(null);
  };

  const breadcrumbs = currentPath.split("/").filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-md">
        <button
          onClick={() => handleNavigate("/")}
          className="hover:text-foreground font-medium"
        >
          repo
        </button>
        {breadcrumbs.map((crumb, index) => {
          const pathSoFar = "/" + breadcrumbs.slice(0, index + 1).join("/");
          return (
            <div key={pathSoFar} className="flex items-center space-x-2">
              <ChevronRight className="w-4 h-4" />
              <button
                onClick={() => handleNavigate(pathSoFar)}
                className="hover:text-foreground font-medium"
              >
                {crumb}
              </button>
            </div>
          );
        })}
      </div>

      {selectedFileId ? (
        <FileViewer repositoryId={repositoryId} fileId={selectedFileId} />
      ) : (
        <div className="border rounded-md overflow-hidden bg-background">
          {isLoading ? (
            <div className="p-4 space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : error ? (
            <div className="p-4 text-red-500">Failed to load files.</div>
          ) : files?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              This repository is empty.
            </div>
          ) : (
            <div className="divide-y">
              {files?.map((file) => (
                <div
                  key={file._id}
                  className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    if (file.type === "folder") {
                      const newPath = currentPath === "/" ? `/${file.name}` : `${currentPath}/${file.name}`;
                      handleNavigate(newPath);
                    } else {
                      setSelectedFileId(file._id);
                    }
                  }}
                >
                  <div className="flex items-center space-x-3 w-1/3">
                    {file.type === "folder" ? (
                      <Folder className="w-5 h-5 text-blue-500 fill-blue-500/20" />
                    ) : (
                      <FileCode className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className="font-medium hover:underline text-sm truncate">
                      {file.name}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground truncate w-1/3 text-left">
                    {file.commitMessage}
                  </div>
                  <div className="text-sm text-muted-foreground w-1/4 text-right">
                    {new Date(file.commitDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
