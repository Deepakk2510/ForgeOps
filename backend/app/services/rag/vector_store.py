from pathlib import Path
import json

import faiss
import numpy as np


BASE_DIR = Path(__file__).resolve().parents[3]

INDEX_DIR = BASE_DIR / "storage" / "indexes"
METADATA_DIR = BASE_DIR / "storage" / "metadata"

INDEX_DIR.mkdir(parents=True, exist_ok=True)
METADATA_DIR.mkdir(parents=True, exist_ok=True)


class VectorStore:

    def __init__(self):

        self.index = None
        self.documents = []

    def build(
        self,
        embeddings,
        documents
    ):

        dimension = embeddings.shape[1]

        self.index = faiss.IndexFlatL2(
            dimension
        )

        self.index.add(
            embeddings.astype(np.float32)
        )

        self.documents = documents

    def save(
        self,
        repo_name: str
    ):

        if self.index is None:
            raise Exception("No FAISS index to save.")

        index_path = INDEX_DIR / f"{repo_name}.faiss"
        metadata_path = METADATA_DIR / f"{repo_name}.json"

        faiss.write_index(
            self.index,
            str(index_path)
        )

        with open(
            metadata_path,
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(
                self.documents,
                f,
                ensure_ascii=False,
                indent=2
            )

    def load(
        self,
        repo_name: str
    ):

        index_path = INDEX_DIR / f"{repo_name}.faiss"
        metadata_path = METADATA_DIR / f"{repo_name}.json"

        if not index_path.exists():
            return False

        self.index = faiss.read_index(
            str(index_path)
        )

        with open(
            metadata_path,
            "r",
            encoding="utf-8"
        ) as f:

            self.documents = json.load(f)

        print("=" * 60)
        print(f"Loaded repository: {repo_name}")
        print("Vectors:", self.index.ntotal)
        print("=" * 60)
        
        return True

    def search(
        self,
        embedding,
        k=5
    ):

        if self.index is None:
            raise Exception(
                "Repository has not been indexed."
            )

        distances, indices = self.index.search(
            embedding.astype(np.float32),
            k
        )

        results = []

        for i in indices[0]:

            if i == -1:
                continue

            results.append(
                self.documents[i]
            )

        return results


vector_store = VectorStore()