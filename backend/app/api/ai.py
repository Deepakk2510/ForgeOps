from fastapi import APIRouter

from app.schemas.ai import (
    RepositorySummaryRequest,
    RepositorySummaryResponse
)

from app.services.ai import ai_service
from app.services.github import github_service

from app.schemas.health import (
    HealthScoreRequest,
    HealthScoreResponse
)

from app.schemas.readme import (
    ReadmeReviewRequest,
    ReadmeReviewResponse
)

from app.schemas.resume import (
    ResumeRequest,
    ResumeResponse
)

from app.schemas.productivity import (
    PortfolioRequest,
    PortfolioResponse,
    ReleaseNotesRequest,
    ReleaseNotesResponse,
    TechStackRequest,
    TechStackResponse
)

from app.services.health import health_analyzer

from app.services.rag.file_loader import file_loader
from app.services.rag.chunker import chunker
from app.services.rag.indexer import repository_indexer

from app.schemas.chat import (
    ChatRequest,
    ChatResponse
)

from app.services.rag.chat import repository_chat

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


@router.get("/test")
async def test_ai():

    return {
        "response": await ai_service.generate(
            "Say hello from ForgeOps AI."
        )
    }


@router.post(
    "/repository-summary",
    response_model=RepositorySummaryResponse
)
async def repository_summary(
    request: RepositorySummaryRequest
):

    context = await github_service.get_repository_context(
        request.repo_name
    )

    summary = await ai_service.repository_summary(
        context
    )

    return {
        "summary": summary
    }

@router.post(
    "/health-score",
    response_model=HealthScoreResponse
)
async def health_score(request: HealthScoreRequest):

    context = await github_service.get_repository_context(
        request.repo_name
    )

    analysis = health_analyzer.analyze(context)

    feedback = await ai_service.explain_health_score(
        analysis
    )

    return {
        **analysis,
        "ai_feedback": feedback
    }

@router.post(
    "/readme-review",
    response_model=ReadmeReviewResponse
)
async def readme_review(
    request: ReadmeReviewRequest
):

    context = await github_service.get_repository_context(
        request.repo_name
    )

    result = await ai_service.review_readme(
        context["readme"]
    )

    return result

@router.post(
    "/resume-generator",
    response_model=ResumeResponse
)
async def resume_generator(
    request: ResumeRequest
):

    context = await github_service.get_repository_context(
        request.repo_name
    )

    result = await ai_service.generate_resume(
        context
    )

    return result

@router.post(
    "/portfolio-generator",
    response_model=PortfolioResponse
)
async def portfolio_generator(
    request: PortfolioRequest
):

    context = await github_service.get_repository_context(
        request.repo_name
    )

    return await ai_service.generate_portfolio(
        context
    )


@router.post(
    "/release-notes",
    response_model=ReleaseNotesResponse
)
async def release_notes(
    request: ReleaseNotesRequest
):

    context = await github_service.get_repository_context(
        request.repo_name
    )

    return await ai_service.generate_release_notes(
        context
    )


@router.post(
    "/tech-stack-analysis",
    response_model=TechStackResponse
)
async def tech_stack_analysis(
    request: TechStackRequest
):

    context = await github_service.get_repository_context(
        request.repo_name
    )

    return await ai_service.analyze_tech_stack(
        context
    )

@router.post("/index/{repo_name}")
async def index_repository(
    repo_name: str
):

    files = await file_loader.load_repository(
        repo_name
    )

    chunks = chunker.chunk(
        files
    )

    repository_indexer.build(
        repo_name,
        chunks
    )

    return {
        "files": len(files),
        "chunks": len(chunks),
        "message": "Repository indexed successfully."
    }

@router.post(
    "/chat",
    response_model=ChatResponse
)
async def chat(
    request: ChatRequest
):

    return await repository_chat.ask(
        request.repo_name,
        request.question
    )