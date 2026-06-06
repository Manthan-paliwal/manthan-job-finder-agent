import google.generativeai as genai
import os
import json

from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def analyze_resume_with_ai(resume_text):

    prompt = f"""
    Analyze this resume as an ATS system.

    Return ONLY valid JSON.

    Format:

    {{
      "score": 85,
      "strengths": [
        "text"
      ],
      "missing_skills": [
        "text"
      ],
      "improvements": [
        "text"
      ]
    }}

    Resume:
    {resume_text}
    """

    try:

        response = model.generate_content(
            prompt
        )

        cleaned_response = (
            response.text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        return json.loads(
            cleaned_response
        )

    except Exception as e:

        return {
            "score": 0,
            "strengths": [],
            "missing_skills": [],
            "improvements": [
                str(e)
            ]
        }