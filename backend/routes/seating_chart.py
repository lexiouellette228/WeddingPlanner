from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict
import random
from collections import defaultdict

router = APIRouter()

# ----------- DATA MODELS -----------

class Guest(BaseModel):
    name: str
    tag_one: str = ""
    tag_two: str = ""

class SeatingRequest(BaseModel):
    guests: List[Guest]
    num_tables: int = 0
    seats_per_table: int = 0
    table_shape: str = ""  # optional

# ----------- CORE FUNCTIONS -----------

def group_guests_by_dual_tags(guests: List[Guest]) -> Dict[str, List[Guest]]:
    grouped = defaultdict(list)
    for guest in guests:
        tag_one = guest.tag1.strip().lower()
        tag_two = guest.tag2.strip().lower()
        grouped[f"tag one:{tag_one}"].append(guest)
        grouped[f"tag two{tag_two}"].append(guest)
    return grouped

def assign_seating_grouped(guests, num_tables, seats_per_table):
    grouped = group_guests_by_dual_tags(guests)
    tables = {f"Table {i+1}": [] for i in range(num_tables)}
    capacities = {table: seats_per_table for table in tables}
    seat_indices = {table: 0 for table in tables}
    seated = set()

    def assign_guest_to_table(guest):
        for table in tables:
            if capacities[table] > 0 and guest.name not in seated:
                tables[table].append(guest)
                capacities[table] -= 1
                seated.add(guest.name)
                return True
        return False

    for tag in sorted(grouped.keys()):
        group = grouped[tag]
        for guest in group:
            assign_guest_to_table(guest)

    return tables

# ----------- ROUTE -----------

@router.post("/generate-seating-chart")
def generate_chart(data: SeatingRequest):
    tables = assign_seating_grouped(
        guests=data.guests,
        num_tables=data.num_tables,
        seats_per_table=data.seats_per_table
    )

    for table, guests in tables.items():
        tables[table] = [guest.dict() for guest in guests]

    return tables
