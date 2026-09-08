from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite:///./sutramind.db"
    jwt_secret: str = "sutramind-local-development-secret-change-me"
    access_token_expire_minutes: int = 480
    cors_origins: str = "http://localhost:5173"
    cors_origin_regex: str = r"https://([a-z0-9-]+\.)*vercel\.app"
    seed_on_startup: bool = False

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def sqlalchemy_database_url(self) -> str:
        url = self.database_url
        if url.startswith("postgres://"):
            url = "postgresql://" + url.removeprefix("postgres://")
        if url.startswith("postgresql://"):
            url = "postgresql+psycopg://" + url.removeprefix("postgresql://")
        return url


settings = Settings()
