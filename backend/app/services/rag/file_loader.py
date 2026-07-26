from app.services.github import github_service


ALLOWED_EXTENSIONS = {
    ".py",
    ".js",
    ".ts",
    ".tsx",
    ".java",
    ".cpp",
    ".c",
    ".html",
    ".css",
    ".md"
}


class FileLoader:

    async def load_repository(
        self,
        repo_name: str
    ):

        tree = await github_service.get_repository_tree(
            repo_name
        )

        files = []

        for item in tree:

            if item["type"] != "blob":
                continue

            path = item["path"]

            if not any(
                path.endswith(ext)
                for ext in ALLOWED_EXTENSIONS
            ):
                continue

            try:

                content = await github_service.get_file_content(
                    repo_name,
                    path
                )

                files.append(
                    {
                        "path": path,
                        "content": content
                    }
                )

            except Exception:
                pass

        return files


file_loader = FileLoader()