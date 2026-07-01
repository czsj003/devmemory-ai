from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "DevMemory AI"
    app_env: str = "development"
    database_url: str
    secret_key: str
    access_token_expire_minutes: int = 60
    frontend_url: str = "http://localhost:5173"

    openai_api_key: str | None = None
    embedding_model: str = "text-embedding-3-small"
    embedding_dimension: int = 1536
    use_fake_embeddings: bool = True

    class Config:
        env_file = ".env"


settings = Settings()