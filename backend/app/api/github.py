from fastapi import APIRouter

from app.services.github import github_service

router = APIRouter(
    prefix="/github",
    tags=["GitHub"]
)

@router.get("/repos")
async def get_repositories():
    return await github_service.get_repositories()