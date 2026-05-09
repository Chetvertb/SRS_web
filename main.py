import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from schemas import CardBase, Card, CardCreate, CardScore, CardRepeat
from datetime import date, timedelta as td
from os import path
import json


app = FastAPI(
    title="Card repeat API",
    description="Application to help memorize", 
    version="1.0.0"
)

def read_file(id):
    with open(f'{id}.json', 'r', encoding='utf-8') as f_cards:
        return json.load(f_cards)
    
def write_file(data, id):
    with open(f'{id}.json', 'w', encoding='utf-8') as f_cards:
        json.dump(data, f_cards, ensure_ascii=False, indent=2)

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
    
@app.patch('/{id}/cards/{card_id}')
async def change_period(score: CardScore, card_id: int, id: int):
    cards = read_file(id)
    for ind, val in enumerate(cards):
        if val['index_card'] == card_id:
            interval, ratio = size_ratio(score.Score, val['interval'], val['ratio'])
            val['interval'] = interval
            val['ratio'] = ratio
            val['next_date'] = str(date.today() + td(days=interval))
            cards[ind] = val
            write_file(cards, id)
            return {"message": "Card changed"}
    raise HTTPException(status_code=404, detail="Card not found")
                                   


@app.get('/{id}/cards', response_model=list[CardRepeat])
async def repeat_cards(id: int):
    file = f'{id}.json'
    if path.isfile(file):
        try:
            cards = read_file(id)
            today = date.today()
            cards = [i for i in cards if date.fromisoformat(i['next_date']) <= today]
            return cards
        except json.JSONDecodeError:
            return []
    else:
        return []

@app.post('/{id}/cards')
async def create_card(card: CardBase, id: int):
    if path.isfile(f"{id}.json"):
        try:
            cards = read_file(id)
        except:
            cards = []
    else:
        cards = []
    question, answer = card.question, card.answer
    next_date = (date.today() + td(days=1)).strftime("%Y-%m-%d")
    if len(cards):
        card_id = max(cards, key=lambda x: x['index'])['index'] + 1
    else:
        card_id = 1
    card = {
        "index_card": card_id,
        "question": question,
        "answer": answer,
        "interval": 1,
        "ratio": 2.5,
        "next_date": next_date
        }
    
    cards.append(card)
    write_file(cards, id)
    return {"card": "created", "id": id}
    



if __name__ == '__main__':
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)