import random
import math
from collections import defaultdict
from typing import List, Dict

def group_guests_by_dual_tags(guests: List[Dict]) -> Dict[str, List[Dict]]:
    grouped = defaultdict(list)
    for guest in guests:
        tag1 = guest.get("tag1", "untagged").strip().lower()
        tag2 = guest.get("tag2", "untagged").strip().lower()
        grouped[f"tag1:{tag1}"].append(guest)
        grouped[f"tag2:{tag2}"].append(guest)
    return grouped

def generate_seats_for_table(table: Dict, seats_per_table: int) -> List[Dict]:
    seats = []
    radius = 60 if table["shape"] == "round" else 80
    angle_step = 360 / seats_per_table if table["shape"] == "round" else 180 / max(seats_per_table - 1, 1)

    for i in range(seats_per_table):
        if table["shape"] == "round":
            angle = math.radians(i * angle_step)
            x = table["x"] + radius * math.cos(angle)
            y = table["y"] + radius * math.sin(angle)
        else:
            x = table["x"] + (i - seats_per_table / 2) * 30
            y = table["y"] + (30 if i % 2 == 0 else -30)

        seats.append({
            "id": i + 1,
            "x": x,
            "y": y,
            "label": f"Seat {i + 1}",
            "guest": None
        })
    return seats

def assign_seating_grouped(
    guests: List[Dict],
    num_tables: int = 2,
    seats_per_table: int = 8,
    shape: str = "round"
) -> List[Dict]:
    grouped = group_guests_by_dual_tags(guests)

    tables = [{
        "id": i + 1,
        "shape": shape,
        "label": f"Table {i + 1}",
        "x": 150 + (i % 4) * 250,
        "y": 150 + (i // 4) * 200,
        "seats": generate_seats_for_table({"shape": shape, "x": 0, "y": 0}, seats_per_table)
    } for i in range(num_tables)]

    capacities = {t["id"]: seats_per_table for t in tables}
    seat_indices = {t["id"]: 0 for t in tables}
    seated = set()

    def assign_guest(tid, guest):
        idx = seat_indices[tid]
        table = next(t for t in tables if t["id"] == tid)
        if idx >= seats_per_table: return False
        table["seats"][idx]["guest"] = guest
        seat_indices[tid] += 1
        capacities[tid] -= 1
        seated.add(guest["name"])
        return True

    # Place groups by tag (sorted for stability)
    for tag, group in sorted(grouped.items()):
        filtered = [g for g in group if g["name"] not in seated]
        for guest in filtered:
            for t in tables:
                if capacities[t["id"]] > 0:
                    assign_guest(t["id"], guest)
                    break

    return tables
