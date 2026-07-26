class RepositoryHealthAnalyzer:

    def analyze(self, context: dict):

        score = 100
        checks = []

        # README
        if context["readme"]:
            checks.append({
                "name": "README",
                "status": True,
                "message": "Repository contains documentation."
            })
        else:
            score -= 15
            checks.append({
                "name": "README",
                "status": False,
                "message": "README missing."
            })

        # Commits
        if len(context["commits"]) >= 5:
            checks.append({
                "name": "Commits",
                "status": True,
                "message": "Healthy commit history."
            })
        else:
            score -= 10
            checks.append({
                "name": "Commits",
                "status": False,
                "message": "Very few commits."
            })

        # Languages
        if context["languages"]:
            checks.append({
                "name": "Languages",
                "status": True,
                "message": "Programming language detected."
            })
        else:
            score -= 10
            checks.append({
                "name": "Languages",
                "status": False,
                "message": "No language detected."
            })

        # Description
        if context["repository"]["description"]:
            checks.append({
                "name": "Description",
                "status": True,
                "message": "Repository description available."
            })
        else:
            score -= 10
            checks.append({
                "name": "Description",
                "status": False,
                "message": "Repository description missing."
            })

        score = max(score, 0)

        if score >= 90:
            grade = "A+"
        elif score >= 80:
            grade = "A"
        elif score >= 70:
            grade = "B"
        elif score >= 60:
            grade = "C"
        else:
            grade = "D"

        return {
            "score": score,
            "grade": grade,
            "checks": checks
        }


health_analyzer = RepositoryHealthAnalyzer()