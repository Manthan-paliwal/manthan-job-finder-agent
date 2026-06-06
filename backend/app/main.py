from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.ats import router as ats_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ats_router)

@app.get("/")
def home():
    return {
        "message": "AI Job Finder API Running"
    }