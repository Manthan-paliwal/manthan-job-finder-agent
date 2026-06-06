from fastapi import APIRouter, UploadFile, File
from pypdf import PdfReader
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")

@router.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):

    temp_path = f"temp_{file.filename}"

    with open(temp_path, "wb") as f:
        f.write(await file.read())

    reader = PdfReader(temp_path)

    text = ""

    for page in reader.pages:
        text += page.extract_text()

    prompt = f"""
    Analyze this resume.

    Give:
    1. ATS Score out of 100
    2. Missing Skills
    3. Strengths
    4. Improvement Suggestions

    Resume:
    {text}
    """

    response = model.generate_content(prompt)

    return {
        "analysis": response.text
    }