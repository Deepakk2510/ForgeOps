from fastapi import FastAPI

from app.database.db import Base, engine

from app.models import user
from app.models import photo

from app.api.health import router as health_router
from app.api.auth import router as auth_router
from app.api.user import router as user_router  
from app.api.github import router as github_router

from app.core.config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)

app.include_router(
    health_router,
    prefix="/health",
    tags=["Health"]
)

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    user_router
)

app.include_router(
    github_router
)