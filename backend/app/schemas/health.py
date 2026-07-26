from pydantic import BaseModel


class HealthScoreRequest(BaseModel):
    repo_name: str


class Check(BaseModel):
    name: str
    status: bool
    message: str


class HealthScoreResponse(BaseModel):
    score: int
    grade: str
    checks: list[Check]
    ai_feedback: str