import httpx
import base64

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

    async def get_repository(self, repo_name: str):
        headers = {
            "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
            "Accept": "application/vnd.github+json"
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/repos/Deepakk2510/{repo_name}",
                headers=headers
            )

        response.raise_for_status()

        repo = response.json()

        return {
            "name": repo["name"],
            "description": repo["description"],
            "language": repo["language"],
            "stars": repo["stargazers_count"],
            "forks": repo["forks_count"],
            "watchers": repo["watchers_count"],
            "default_branch": repo["default_branch"],
            "open_issues": repo["open_issues_count"],
            "created_at": repo["created_at"],
            "updated_at": repo["updated_at"],
            "visibility": repo["visibility"]
        }

    async def get_commits(self, repo_name: str):
        headers = {
            "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
            "Accept": "application/vnd.github+json"
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/repos/Deepakk2510/{repo_name}/commits",
                headers=headers
            )

        response.raise_for_status()

        commits = response.json()

        return [
            {
                "sha": commit["sha"][:7],
                "message": commit["commit"]["message"],
                "author": commit["commit"]["author"]["name"],
                "date": commit["commit"]["author"]["date"]
            }
            for commit in commits
        ]

    async def get_branches(self, repo_name: str):
        headers = {
            "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
            "Accept": "application/vnd.github+json"
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/repos/Deepakk2510/{repo_name}/branches",
                headers=headers
            )

        response.raise_for_status()

        branches = response.json()

        return [
            {
                "name": branch["name"],
                "protected": branch["protected"]
            }
            for branch in branches
        ]  

    async def get_contributors(self, repo_name: str):
        headers = {
            "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
            "Accept": "application/vnd.github+json"
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/repos/Deepakk2510/{repo_name}/contributors",
                headers=headers
            )

        response.raise_for_status()

        contributors = response.json()

        return [
            {
                "username": contributor["login"],
                "contributions": contributor["contributions"]
            }
            for contributor in contributors
        ]

    async def get_contributors(self, repo_name: str):
        headers = {
            "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
            "Accept": "application/vnd.github+json"
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/repos/Deepakk2510/{repo_name}/contributors",
                headers=headers
            )

        response.raise_for_status()

        contributors = response.json()

        return [
            {
                "username": contributor["login"],
                "contributions": contributor["contributions"]
            }
            for contributor in contributors
        ]
    async def get_languages(self, repo_name: str):
        headers = {
            "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
            "Accept": "application/vnd.github+json"
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/repos/Deepakk2510/{repo_name}/languages",
                headers=headers
            )

        response.raise_for_status()

        return response.json()
    
    async def get_readme(self, repo_name: str):
        headers = {
            "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
            "Accept": "application/vnd.github+json"
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/repos/Deepakk2510/{repo_name}/readme",
                headers=headers
            )
        if response.status_code == 404:
            return {
                "message": "README not found."
            }
        
        response.raise_for_status()

        data = response.json()

        content = base64.b64decode(data["content"]).decode("utf-8")

        return {
            "name": data["name"],
            "content": content
        }
    
github_service = GitHubService()