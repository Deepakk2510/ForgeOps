from app.services.ai import ai_service
from app.services.rag.search import repository_search
from app.services.rag.vector_store import vector_store


class RepositoryChat:

    async def ask(
        self,
        repo_name: str,
        question: str
    ):

        loaded = vector_store.load(repo_name)

        if not loaded:
            raise Exception(
                f"Repository '{repo_name}' has not been indexed."
            )

        chunks = repository_search.search(question)

        context = ""

        references = []

        for chunk in chunks:

            context += f"""

FILE:
{chunk['path']}

CODE:
{chunk['content']}

"""

            references.append(
                chunk["path"]
            )

        prompt = ai_service.load_prompt(
            "repository_chat.txt"
        )

        prompt = prompt.format(
            context=context,
            question=question
        )

        answer = await ai_service.generate(
            prompt
        )

        return {
            "answer": answer,
            "references": sorted(
                list(set(references))
            )
        }


repository_chat = RepositoryChat()