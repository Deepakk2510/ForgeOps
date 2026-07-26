import httpx

from app.core.config import settings


class GitHubService:
    BASE_URL = "https://api.github.com"

    async def get_repositories(self):
        headers = {
            "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
            "Accept": "application/vnd.github+json"
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/user/repos",
                headers=headers
            )

        response.raise_for_status()

        repos = response.json()

        return [
            {
                "name": repo["name"],
                "private": repo["private"],
                "language": repo["language"],
                "stars": repo["stargazers_count"],
                "url": repo["html_url"]
            }
            for repo in repos
        ]


github_service = GitHubService()