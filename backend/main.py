from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.analyze_call import router as analyze_router
from app.routes.post_calls import router as post_call_router

app = FastAPI(title="Sales AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(post_call_router)
app.include_router(analyze_router)


@app.get("/")
async def root():
    return {"message": "Sales AI backend running"}


@app.get("/api/health")
async def health():
    return {"message": "Backend connected successfully"}
