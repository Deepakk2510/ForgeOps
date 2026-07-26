from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.utils.security import hash_password

from fastapi import HTTPException
from app.schemas.user import Token
from fastapi.security import OAuth2PasswordRequestForm
from app.utils.security import verify_password
from app.utils.jwt import create_access_token

from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter()


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):

    print(user.password)
    print(type(user.password))

    db_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    # print("Username received:", form_data.username)
    # print("Password received:", form_data.password)

    db_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    # print("DB User:", db_user)

    if db_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # print("Stored Hash:", db_user.password)
    # print("Password Match:", verify_password(form_data.password, db_user.password))

    if not verify_password(form_data.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
        {"sub": db_user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }