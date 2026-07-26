from pydantic import BaseModel


class RepositorySummaryRequest(BaseModel):
    repo_name: str


class RepositorySummaryResponse(BaseModel):
    summary: str