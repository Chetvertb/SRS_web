from pydantic import BaseModel, Field
from datetime import date

class CardBase(BaseModel):
    question: str
    answer: str

class CardCreate(CardBase):
    pass 

class CardRepeat(CardBase):
    id: int

class Card(CardRepeat):
    interval: int
    ratio: float
    next_date: date


class Config:
    from_attributes = True
    
class CardScore(BaseModel):
    Score: int = Field(..., ge=1, le=5)