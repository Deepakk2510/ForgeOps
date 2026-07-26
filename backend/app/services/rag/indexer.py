from app.services.rag.embeddings import embedding_service
from app.services.rag.vector_store import vector_store


class RepositoryIndexer:

    def build(
        self,
        repo_name: str,
        chunks
    ):

        documents = [
            chunk["content"]
            for chunk in chunks
        ]

        embeddings = embedding_service.embed(
            documents
        )

        vector_store.build(
            embeddings,
            chunks
        )

        vector_store.save(
            repo_name
        )


repository_indexer = RepositoryIndexer()