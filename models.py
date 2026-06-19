from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class DBCard(Base):
    __tablename__ = "cards"

    index_card = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)
    interval = Column(Integer, default=1)
    ratio = Column(Float, default=2.5)
    next_date = Column(Date, nullable=False)
    owner = relationship("DBUser", back_populates="cards")


class DBUser(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    usermail = Column(String, nullable=False)
    cards = relationship("DBCard", back_populates="owner", cascade="all, delete-orphan")
    
