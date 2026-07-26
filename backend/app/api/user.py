from fastapi import APIRouter, Depends

from app.models.user import User
from app.utils.jwt import get_current_user

router = APIRouter(
    prefix="/user",
    tags=["User"]
)


@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }