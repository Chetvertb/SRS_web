from pydantic import BaseModel, Field
from datetime import date

class Base(BaseModel):
    model_config = {
        'from_attributes': True
    }

class CardBase(Base):
    question: str
    answer: str

class CardCreate(CardBase):
    pass 

class CardRepeat(CardBase):
    index_card: int

class Card(CardRepeat):
    interval: int
    ratio: float
    next_date: date
    
class CardScore(Base):
    Score: int = Field(..., ge=1, le=5)