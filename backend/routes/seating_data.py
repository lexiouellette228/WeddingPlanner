from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi import APIRouter
from pydantic import BaseModel
import json
import os
from pydantic import BaseModel

router = APIRouter()
DATA_FILE = "data/seating_data.json"

# Data Models
class Seat(BaseModel):
    id: str
    guest: Optional[str] = None
    x: Optional[float] = 0
    y: Optional[float] = 0 

class TableData(BaseModel):
    id: str
    name: str
    type: str 
    x: float
    y: float
    sizeLabel: str
    seatCount: int
    seats: List[Seat]

# Functions
def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

# Routes
# GET: Retrieve saved seating chart
@router.get("/seating")
def get_seating():
    return load_data()

# POST: Save seating chart
@router.post("/seating")
def save_seating(tables: List[TableData]):
    save_data([table.dict() for table in tables])
    return {"message": "Seating saved successfully."}

# DELETE: delete seating chart
@router.delete("/seating")
def reset_seating():
    save_data([])
    return {"message": "Seating layout deleted."}
