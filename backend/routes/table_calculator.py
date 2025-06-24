from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict
import math
import json
import os
import uuid

router = APIRouter()
SELECTED_LAYOUT = "data/selected_layout.json"

os.makedirs("data", exist_ok=True)
if not os.path.exists(SELECTED_LAYOUT):
    with open(GUESTS_FILE, "w") as f:
        json.dump([], f)

class GuestCount(BaseModel):
    count: int

# Table config (same as before)
table_options = {
    "round": [
        {"name": '30" Round', "seatsMin": 2, "seatsMax": 3}, 
        {"name": '48" Round', "seatsMin": 6, "seatsMax": 8}, 
        {"name": '60" Round', "seatsMin": 8, "seatsMax": 10}, 
        {"name": '72" Round', "seatsMin": 10, "seatsMax": 12}, 
    ],
    "rectangle": [
        {"name": "6' Rectangle", "seatsMin": 6, "seatsMax": 6}, 
        {"name": "8' Rectangle", "seatsMin": 8, "seatsMax": 10}, 
    ]
}

@router.post("/calculate-tables")
def get_table_options(data: GuestCount):
    guest_count = data.count
    result = {"round": [], "rectangle": []}

    for shape, tables in table_options.items():
        for table in tables:
            min_tables = math.ceil(guest_count / table["seatsMax"])
            max_tables = math.ceil(guest_count / table["seatsMin"])
            result[shape].append({
                "name": table["name"],
                "min_needed": min_tables,
                "max_needed": max_tables,
                "seats_per_table": f"{table['seatsMin']}-{table['seatsMax']}"
            })

    return result

@router.post("/calculate-mixed")
def get_mixed_combinations(data: GuestCount):
    guest_count = data.count
    combinations = []

    round_tables = table_options["round"]
    rectangle_tables = table_options["rectangle"]

    for rtype in round_tables:
        for rectype in rectangle_tables:
            max_r = guest_count // rtype["seatsMin"] + 1
            max_rect = guest_count // rectype["seatsMin"] + 1

            for r_count in range(0, max_r + 1):
                for rect_count in range(0, max_rect + 1):
                    min_capacity = (r_count * rtype["seatsMin"]) + (rect_count * rectype["seatsMin"])
                    max_capacity = (r_count * rtype["seatsMax"]) + (rect_count * rectype["seatsMax"])
                    if min_capacity <= guest_count <= max_capacity:
                        combinations.append({
                            "round": {"type": rtype["name"], "count": r_count},
                            "rectangle": {"type": rectype["name"], "count": rect_count},
                            "total_tables": r_count + rect_count,
                            "min_seats": min_capacity,
                            "max_seats": max_capacity,
                            "extra_min": min_capacity - guest_count,
                            "extra_max": max_capacity - guest_count
                        })

    combinations.sort(key=lambda x: x["total_tables"])
    return {"combinations": combinations[:20]}

@router.post("/save-layout")
def save_selected_layout(layout: dict):
    with open("data/selected_layout.json", "w") as f:
        json.dump(layout.get("tables", []), f)  # Save only the list of tables
    return {"message": "Layout saved"}

@router.get("/load-layout")
def load_selected_layout():
    try:
        with open("data/selected_layout.json") as f:
            return json.load(f)  # should be a list of tables
    except Exception:
        return []
