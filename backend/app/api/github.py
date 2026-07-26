from fastapi import APIRouter

from app.services.github import github_service

router = APIRouter(
    prefix="/github",
    tags=["GitHub"]
)

@router.get("/repos")
async def get_repositories():
    return await github_service.get_repositories()

@router.get("/repos/{repo_name}")
async def get_repository(repo_name: str):
    return await github_service.get_repository(repo_name)

@router.get("/repos/{repo_name}/commits")
async def get_commits(repo_name: str):
    return await github_service.get_commits(repo_name)

@router.get("/repos/{repo_name}/branches")
async def get_branches(repo_name: str):
    return await github_service.get_branches(repo_name)


@router.get("/repos/{repo_name}/contributors")
async def get_contributors(repo_name: str):
    return await github_service.get_contributors(repo_name)


@router.get("/repos/{repo_name}/languages")
async def get_languages(repo_name: str):
    return await github_service.get_languages(repo_name)


@router.get("/repos/{repo_name}/readme")
async def get_readme(repo_name: str):
    return await github_service.get_readme(repo_name)