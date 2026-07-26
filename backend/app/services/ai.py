import json
from pathlib import Path

from openai import OpenAI

from app.core.config import settings


class AIService:

    def __init__(self):
        self.client = OpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url="https://api.groq.com/openai/v1"
        )

    async def generate(self, prompt: str):

        response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3
        )

        return response.choices[0].message.content

    def load_prompt(self, filename: str):

        prompt_path = (
            Path(__file__).parent.parent
            / "prompts"
            / filename
        )

        return prompt_path.read_text(
            encoding="utf-8"
        )

    def parse_json_response(self, response: str):

        response = response.strip()

        response = response.replace("```json", "")
        response = response.replace("```", "")
        response = response.strip()

        print("=" * 50)
        print("LLM RESPONSE")
        print("=" * 50)
        print(response)
        print("=" * 50)

        return json.loads(response)

    async def generate_json(
        self,
        prompt_file: str,
        context: dict
    ):

        prompt = self.load_prompt(prompt_file)

        prompt = prompt.format(**context)

        last_exception = None

        for _ in range(2):

            try:

                response = await self.generate(prompt)

                return self.parse_json_response(response)

            except Exception as e:
                last_exception = e

        raise last_exception

    # --------------------------------------------------
    # Text Generation
    # --------------------------------------------------

    async def repository_summary(
        self,
        context: dict
    ):

        prompt = self.load_prompt(
            "repository_summary.txt"
        )

        prompt = prompt.format(
            repository=context["repository"],
            languages=context["languages"],
            commits=context["commits"],
            readme=context["readme"]
        )

        return await self.generate(prompt)

    async def explain_health_score(
        self,
        analysis: dict
    ):

        prompt = self.load_prompt(
            "health_score.txt"
        )

        prompt = prompt.format(
            score=analysis["score"],
            grade=analysis["grade"],
            checks=analysis["checks"]
        )

        return await self.generate(prompt)

    # --------------------------------------------------
    # JSON Generation
    # --------------------------------------------------

    async def review_readme(
        self,
        readme: str
    ):

        return await self.generate_json(
            "readme_review.txt",
            {
                "readme": readme
            }
        )

    async def generate_resume(
        self,
        context: dict
    ):

        return await self.generate_json(
            "resume_generator.txt",
            context
        )

    async def generate_portfolio(
        self,
        context: dict
    ):

        return await self.generate_json(
            "portfolio_generator.txt",
            {
                "repository": context["repository"],
                "languages": context["languages"],
                "readme": context["readme"]
            }
        )

    async def generate_release_notes(
        self,
        context: dict
    ):

        return await self.generate_json(
            "release_notes.txt",
            {
                "commits": context["commits"]
            }
        )

    async def analyze_tech_stack(
        self,
        context: dict
    ):

        return await self.generate_json(
            "tech_stack_analysis.txt",
            {
                "repository": context["repository"],
                "languages": context["languages"],
                "readme": context["readme"]
            }
        )


ai_service = AIService()