from pydantic import BaseModel


class PortfolioRequest(BaseModel):
    repo_name: str


class PortfolioResponse(BaseModel):
    title: str
    description: str


class ReleaseNotesRequest(BaseModel):
    repo_name: str


class ReleaseNotesResponse(BaseModel):
    release_notes: list[str]


class TechStackRequest(BaseModel):
    repo_name: str


class Technology(BaseModel):
    name: str
    purpose: str


class TechStackResponse(BaseModel):
    technologies: list[Technology]