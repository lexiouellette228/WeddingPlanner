from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Literal
import json
import os
from .seating_utils import generate_seating, save_auto_chart, load_auto_chart

router = APIRouter()
DATA_PATH = 'data/seating_chart.json'

class Guest(BaseModel):
    id: Optional[str]
    name: str
    tag_one: Optional[str] = ""
    tag_two: Optional[str] = ""

class SeatingRequest(BaseModel):
    guests: List[Guest]
    num_tables: int
    seats_per_table: int
    shape: Optional[Literal["round", "rectangle"]] = "round"

# Post: save generated chart
@router.post("/auto-generate")
def auto_generate_seating(request: SeatingRequest):
    try:
        guest_dicts = [g.dict() for g in request.guests]

        tables = generate_seating(
            guests=guest_dicts,
            num_tables=request.num_tables,
            seats_per_table=request.seats_per_table,
            shape=request.shape
        )

        # Ensure JSON serializable
        return {
            "message": "Seating chart generated",
            "tables": tables  # <- must be a list of dicts
        }
    except Exception as e:
        print("AUTO GENERATE ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))

# Post: Save chart to file 
@router.post("/save-auto")
def save_seating(tables: List[dict]):
    save_auto_chart(tables)
    return {"message": "Seating chart saved."}

# Get: retrieve saved list
@router.get("/load-auto-chart")
def get_auto_chart():
    tables = load_auto_chart()
    return {"tables": tables}
