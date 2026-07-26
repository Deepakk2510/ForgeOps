from pydantic import BaseModel


class ChatRequest(BaseModel):
    repo_name: str
    question: str


class ChatResponse(BaseModel):
    answer: str
    references: list[str]