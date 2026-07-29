import type { UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormValues {
  name: string;
  description: string;
  language: string;
  website: string;
  license: string;
  visibility: "Public" | "Private";
  status: "Active" | "Building" | "Archived";
  topics: string;
}

interface Props {
  register: UseFormRegister<FormValues>;
}

export default function RepositorySettingsForm({
  register,
}: Props) {
  return (
    <div className="space-y-8">
      {/* General */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="mb-5 text-xl font-semibold">
          General
        </h2>

        <div className="space-y-5">
          <div>
            <Label>Name</Label>

            <Input {...register("name")} />
          </div>

          <div>
            <Label>Description</Label>

            <Textarea
              rows={4}
              {...register("description")}
            />
          </div>

          <div>
            <Label>Language</Label>

            <Input {...register("language")} />
          </div>
        </div>
      </section>

      {/* Metadata */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="mb-5 text-xl font-semibold">
          Repository Metadata
        </h2>

        <div className="space-y-5">
          <div>
            <Label>Website</Label>

            <Input {...register("website")} />
          </div>

          <div>
            <Label>License</Label>

            <Input {...register("license")} />
          </div>

          <div>
            <Label>Topics</Label>

            <Input
              placeholder="react, typescript, mongodb"
              {...register("topics")}
            />
          </div>
        </div>
      </section>

      {/* Repository */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="mb-5 text-xl font-semibold">
          Repository
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label>Visibility</Label>

            <select
              className="mt-2 w-full rounded-md border bg-background p-2"
              {...register("visibility")}
            >
              <option value="Public">
                Public
              </option>

              <option value="Private">
                Private
              </option>
            </select>
          </div>

          <div>
            <Label>Status</Label>

            <select
              className="mt-2 w-full rounded-md border bg-background p-2"
              {...register("status")}
            >
              <option value="Active">
                Active
              </option>

              <option value="Building">
                Building
              </option>

              <option value="Archived">
                Archived
              </option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}