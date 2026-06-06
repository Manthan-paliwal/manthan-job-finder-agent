from fastapi import APIRouter, UploadFile, File
import shutil
import os

from app.services.pdf_service import extract_text_from_pdf
from app.services.gemini_service import analyze_resume_with_ai

router = APIRouter()

UPLOAD_DIR = "uploads"


@router.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):

    # Create uploads folder
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # File save path
    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text from PDF
    resume_text = extract_text_from_pdf(file_path)

    # Analyze using Gemini
    analysis = analyze_resume_with_ai(resume_text)

    return {
        "filename": file.filename,
        "analysis": analysis
    }