import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import RepositorySettingsForm from "@/components/repositories/settings/RepositorySettingsForm";
import DangerZone from "@/components/repositories/settings/DangerZone";
import CollaboratorsSettings from "@/components/repositories/settings/CollaboratorsSettings";

import {
  repositoryService,
  type RepositoryPayload,
} from "@/services/repository.service";

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

export default function RepositorySettingsPage() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"general" | "collaborators">("general");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    if (!id) return;

    const loadRepository = async () => {
      try {
        const res = await repositoryService.getById(id);

        const repo = res.data;

        reset({
          name: repo.name,
          description: repo.description,
          language: repo.language,
          website: repo.website,
          license: repo.license,
          visibility: repo.visibility,
          status: repo.status,
          topics: repo.topics.join(", "),
        });
      } catch (err) {
        console.error(err);
      }
    };

    loadRepository();
  }, [id, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!id) return;

    const payload: Partial<RepositoryPayload> = {
      name: values.name,
      description: values.description,
      language: values.language,
      website: values.website,
      license: values.license,
      visibility: values.visibility,
      status: values.status,
      topics: values.topics
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      await repositoryService.update(id, payload);

      alert("Repository updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update repository.");
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    const ok = window.confirm(
      "Delete this repository permanently?"
    );

    if (!ok) return;

    try {
      await repositoryService.delete(id);

      alert("Repository deleted.");

      navigate("/repositories");
    } catch (err) {
      console.error(err);
      alert("Failed to delete repository.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Repository Settings
        </h1>
      </div>

      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === "general" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab("collaborators")}
          className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === "collaborators" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Collaborators
        </button>
      </div>

      {activeTab === "general" && (
        <div className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <RepositorySettingsForm
                  register={register}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <DangerZone onDelete={handleDelete} />
        </div>
      )}

      {activeTab === "collaborators" && id && (
        <CollaboratorsSettings repositoryId={id} />
      )}
    </div>
  );
}