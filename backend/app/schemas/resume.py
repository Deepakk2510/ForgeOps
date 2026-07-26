from pydantic import BaseModel


class ResumeRequest(BaseModel):
    repo_name: str


class ResumeResponse(BaseModel):
    project_title: str
    resume_points: list[str]