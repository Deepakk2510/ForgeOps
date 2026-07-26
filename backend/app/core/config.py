from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    APP_NAME: str
    APP_VERSION: str

    # Server
    HOST: str
    PORT: int

    # Database
    DATABASE_URL: str

    # JWT
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # AI
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    # GitHub
    GITHUB_TOKEN: str

    class Config:
        env_file = ".env"


settings = Settings()