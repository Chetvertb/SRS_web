import uvicorn

from fastapi import FastAPI, HTTPException, Depends, status
from datetime import date, timedelta as td
from os import path
import json
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import select, or_
from passlib.context import CryptContext

from schemas import CardBase, Card, CardCreate, CardScore, CardRepeat, UserLogin, UserRegistration
from database import engine, get_db
import models
from models import DBCard, DBUser
models.Base.metadata.create_all(bind=engine)




app = FastAPI(
    title="Cards repeat API",
    description="Application to help memorize", 
    version="1.0.0"
)

app.mount("/static", StaticFiles(directory="static"), name="static")

origins = [
    "http://localhost",
    "http://0.0.0.0",
    "http://localhost:8000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    '''create hash password'''
    return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    '''check password'''
    return pwd_context.verify(password, hashed_password)

def size_ratio(mark, interval, ratio):
    '''Function сalculates the repetition interval based on the evaluation'''
    if mark == 2:
        return 1, 2.5
    elif mark == 3:
        ratio -= 0.2
    elif mark == 4:
        pass
    else:
        ratio += 0.2

    interval = max(1, int(interval * ratio))
    return interval, ratio

@app.get('/')
async def read_index():
    return FileResponse("static/index.html")

@app.post('/registration')
async def create_user(user_data: UserRegistration, db: Session = Depends(get_db)):
    query = select(DBUser).where(or_(DBUser.username == user_data.username, 
                                     DBUser.usermail == user_data.usermail)
                                     )
    result = db.execute(query).scalar_one_or_none()
    if result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким именем или почтой уже существует."
        )
    new_user = DBUser(username = user_data.username, 
                      usermail = user_data.usermail, 
                      hashed_password = get_password_hash(user_data.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"status": "success", "user_id": new_user.id, "username": new_user.username}
    

@app.post('/login')
async def authentication(user_data: UserLogin, db: Session = Depends(get_db)):
    query = select(DBUser).where(DBUser.username == user_data.username)
    result = db.execute(query).scalar_one_or_none()
    if result:
        if user_data.password:
            if verify_password(user_data.password, result.hashed_password):
                return {"status": "success", "user_id": result.id, "username": result.username}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Неверное имя пользователя или пароль")




@app.patch('/{id}/cards/{card_id}')
async def change_period(score: CardScore, card_id: int, id: int, db: Session = Depends(get_db)):
    query  = select(DBCard).where(DBCard.index_card == card_id)
    card = db.execute(query).scalar_one_or_none()
    if card:
        interval, ratio = size_ratio(score.Score, card.interval, card.ratio)
        card.next_date = date.today() + td(days=interval)
        card.interval = interval
        card.ratio = ratio
        db.commit()
        return {"message": "Card changed"}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

                                   


@app.get('/{id}/cards', response_model=list[CardRepeat])
async def repeat_cards(id: int, db: Session = Depends(get_db)):
    today = date.today()
    query = select(DBCard).where(DBCard.next_date <= today, 
                                 DBCard.user_id == id)
    cards = db.execute(query).scalars().all()
    return cards
    

@app.get('/{id}/all_cards', response_model=list[CardBase])
async def look_cards(id: int, db: Session = Depends(get_db)):
    query = select(DBCard).where(DBCard.user_id == id)
    result = db.execute(query)
    cards = result.scalars().all()
    return cards

@app.post('/{id}/cards')
async def create_card(card: CardBase, id: int, db: Session = Depends(get_db)):
    next_date_obj = date.today() + td(days=1)
    card = models.DBCard(
        user_id = id,
        question = card.question,
        answer = card.answer,
        next_date = next_date_obj
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return {"status": "success", "card": card}
    



if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)