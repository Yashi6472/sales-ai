from fastapi import APIRouter
from app.data.sample_meetings import sample_meetings

router = APIRouter()

@router.get("/api/post-calls")
def get_post_calls():
    return sample_meetings