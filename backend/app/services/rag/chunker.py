class CodeChunker:

    def chunk(
        self,
        files,
        chunk_size=800,
        overlap=150
    ):

        chunks = []

        for file in files:

            text = file["content"]

            start = 0

            while start < len(text):

                end = start + chunk_size

                chunks.append(
                    {
                        "path": file["path"],
                        "content": text[start:end]
                    }
                )

                start += chunk_size - overlap

        return chunks


chunker = CodeChunker()