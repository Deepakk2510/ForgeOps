from app.services.rag.embeddings import embedding_service
from app.services.rag.vector_store import vector_store


class RepositorySearch:

    def search(
        self,
        question: str
    ):

        embedding = embedding_service.embed(
            [question]
        )

        return vector_store.search(
            embedding,
            k=5
        )


repository_search = RepositorySearch()