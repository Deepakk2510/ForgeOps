from pydantic import BaseModel


class ReadmeReviewRequest(BaseModel):
    repo_name: str


class ReadmeReviewResponse(BaseModel):
    overall_rating: int
    strengths: list[str]
    missing_sections: list[str]
    recommendations: list[str]