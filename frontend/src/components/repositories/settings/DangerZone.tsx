import { Button } from "@/components/ui/button";

interface Props {
  onDelete: () => void;
}

export default function DangerZone({
  onDelete,
}: Props) {
  return (
    <div className="rounded-xl border border-red-500 p-6">
      <h2 className="text-xl font-bold text-red-500">
        Danger Zone
      </h2>

      <p className="mt-2 text-muted-foreground">
        Deleting a repository is permanent.
        This action cannot be undone.
      </p>

      <Button
        variant="destructive"
        className="mt-5"
        onClick={onDelete}
      >
        Delete Repository
      </Button>
    </div>
  );
}