from pathlib import Path

from openai import OpenAI

from app.core.config import settings
import json
import re

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

    async def explain_health_score(self, analysis: dict):

        prompt = self.load_prompt("health_score.txt")

        prompt = prompt.format(
            score=analysis["score"],
            grade=analysis["grade"],
            checks=analysis["checks"]
        )

        return await self.generate(prompt)

    async def review_readme(self, readme: str):

        prompt = self.load_prompt(
            "readme_review.txt"
        )

        prompt = prompt.format(
            readme=readme
        )

        response = await self.generate(
            prompt
        )

        return self.parse_json_response(response)

    async def generate_resume(self, context: dict):

        prompt = self.load_prompt(
            "resume_generator.txt"
        )

        prompt = prompt.format(
            repository=context["repository"],
            languages=context["languages"],
            commits=context["commits"],
            readme=context["readme"]
        )

        response = await self.generate(prompt)

        return self.parse_json_response(response)

    async def generate_portfolio(self, context: dict):

        prompt = self.load_prompt(
            "portfolio_generator.txt"
        )

        prompt = prompt.format(
            repository=context["repository"],
            languages=context["languages"],
            readme=context["readme"]
        )

        response = await self.generate(prompt)

        return self.parse_json_response(response)

    async def generate_release_notes(self, context: dict):

        prompt = self.load_prompt(
            "release_notes.txt"
        )

        prompt = prompt.format(
            commits=context["commits"]
        )

        response = await self.generate(prompt)

        return self.parse_json_response(response)


    async def analyze_tech_stack(self, context: dict):

        prompt = self.load_prompt(
            "tech_stack_analysis.txt"
        )

        prompt = prompt.format(
            repository=context["repository"],
            languages=context["languages"],
            readme=context["readme"]
        )

        response = await self.generate(prompt)

        return self.parse_json_response(response)

    def parse_json_response(self, response: str):

        try:
            response = response.strip()

            # Remove markdown code fences
            response = response.replace("```json", "")
            response = response.replace("```", "")
            response = response.strip()

            print("=" * 50)
            print(response)
            print("=" * 50)

            return json.loads(response)

        except Exception as e:
            print("JSON Parsing Failed!")
            print(response)
            raise e
    
ai_service = AIService()