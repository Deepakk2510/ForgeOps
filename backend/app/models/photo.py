from sqlalchemy import Column, Integer, String

from app.database.db import Base


class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String)

    filepath = Column(String)

    description = Column(String)