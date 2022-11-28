from lib2to3.pytree import Base
from tkinter.tix import INTEGER
import uvicorn
from fastapi import FastAPI , status 
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from typing import List

class Book(BaseModel):
    id : int = None 
    volume_id : str
    title : str 
    authors : str = None
    thumbnail : str = None 
    state : int
    rating : int = None 

class UpdateRatingRequestBody(BaseModel):
    volume_id : str 
    new_rating : int

class UpdateStateRequestBody(BaseModel):
    volume_id : str
    new_state : int

    
app = FastAPI(debug=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/status")
async def check_status():
    return "hello word"

@app.get("/books" , response_model = List[Book ], status_code=status.HTTP_200_OK)

async def get_books():
    conn = psycopg2.connect(
        database="DB_BOOK" , user ="postgres" , password="postgres",host="172.20.0.2"
    )
    cur = conn.cursor()
    cur.execute("SELECT * FROM book_library")
    rows = cur.fetchall()

    formatted_books = []
    for row in rows : 
        formatted_books.append(
            Book(
                id=row[0],
                volume_id=row[1],
                title=row[2],
                authors=row[3],
                thumbnail=row[4],
                state=row[5],
                rating=row[6],
            )
        )
    cur.close()
    conn.close()

    return formatted_books

@app.post("/books", status_code=status.HTTP_201_CREATED)
async def new_book(book:Book):
    conn = psycopg2.connect(
        database="DB_BOOK" , user ="postgres" , password="postgres",host="172.20.0.2"
    )
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO book_library (volume_id , title , authors ,  thumbnail  , state) VALUES ('{book.volume_id}','{book.title}','{book.authors}', '{book.thumbnail}', '{book.state}')"
        )
    cur.close()
    conn.commit()
    conn.close()
    return

@app.put("/books/update_rating" , status_code=200)
async def update_rating(update_rating_body:UpdateRatingRequestBody):
    conn = psycopg2.connect(
        database="DB_BOOK" , user ="postgres" , password="postgres",host="172.20.0.2"
    )
    cur = conn.cursor()
    cur.execute(
        f"UPDATE book_library SET rating={update_rating_body.new_rating} WHERE volume_id='{update_rating_body.volume_id}'"
    )
    cur.close()
    conn.commit()
    conn.close()
    return

@app.put("/books/update_book_state",status_code=200)
async def update_state(update_state_request_body:UpdateStateRequestBody):
    conn = psycopg2.connect(
        database="DB_BOOK" , user ="postgres" , password="postgres",host="172.20.0.2"
    )
    cur = conn.cursor()
    cur.execute(
        f"UPDATE book_library SET state={update_state_request_body.new_state} WHERE volume_id='{update_state_request_body.volume_id}'"
    )
    cur.close()
    conn.commit()
    conn.close()
    return
if __name__ == "__main__":
    uvicorn.run(app,host="0.0.0.0",port=8000)