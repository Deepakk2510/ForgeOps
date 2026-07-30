import { useQuery } from "@tanstack/react-query";
import { fileService } from "@/services/file.service";
import { Skeleton } from "@/components/ui/skeleton";

interface FileViewerProps {
  repositoryId: string;
  fileId: string;
}

export default function FileViewer({ repositoryId, fileId }: FileViewerProps) {
  const { data: file, isLoading, error } = useQuery({
    queryKey: ["file", fileId],
    queryFn: () => fileService.getFileContent(repositoryId, fileId),
  });

  if (isLoading) {
    return (
      <div className="border rounded-md p-4">
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (error || !file) {
    return <div className="text-red-500 border p-4 rounded-md">Failed to load file.</div>;
  }

  return (
    <div className="border rounded-md overflow-hidden bg-background">
      <div className="border-b bg-muted/50 p-3 text-sm font-medium flex items-center">
        {file.name}
      </div>
      <div className="p-4 overflow-x-auto text-sm">
        <pre className="text-muted-foreground">
          <code>{file.content}</code>
        </pre>
      </div>
    </div>
  );
}
