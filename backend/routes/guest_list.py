from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import os
import uuid

router = APIRouter()
GUESTS_FILE = "data/guests.json"

os.makedirs("data", exist_ok=True)
if not os.path.exists(GUESTS_FILE):
    with open(GUESTS_FILE, "w") as f:
        json.dump([], f)

class Guest(BaseModel):
    id: Optional[str] = None
    name: str
    tag_one: Optional[str] = ""
    tag_two: Optional[str] = ""

def load_guests():
    with open(GUESTS_FILE, "r") as f:
        return json.load(f)

def save_guests(guests):
    with open(GUESTS_FILE, "w") as f:
        json.dump(guests, f, indent=2)

class GuestListPayload(BaseModel):
    guests: List[Guest]

# Post: Save full guest list
@router.post("/guests")
def save_guest_list(payload: GuestListPayload):
    updated_guests = []
    for guest in payload.guests:
        if not guest.id:
            guest.id = str(uuid.uuid4())
        updated_guests.append(guest.dict())
    save_guests(updated_guests)
    return {"message": "Guests saved", "guests": updated_guests}
    
# Get: Retrieve guest list
@router.get("/guests")
def get_guest_list():
    return load_guests()

# Put: Update a guest
@router.put("/guests/{guest_id}")
def update_guest(guest_id: str, updated_guest: Guest):
    guests = load_guests()

    for i, guest in enumerate(guests):
        if guest["id"] == guest_id:
            updated = updated_guest.dict()
            updated["id"] = guest_id  # preserve the ID
            guests[i] = updated
            save_guests(guests)
            return {"message": "Guest updated", "guest": updated}

    raise HTTPException(status_code=404, detail="Guest not found")


# Delete: Remove a guest
@router.delete("/guests/{guest_id}")
def delete_guest(guest_id: str):
    guests = load_guests()
    updated = [g for g in guests if g["id"] != guest_id]
    if len(guests) == len(updated):
        raise HTTPException(status_code=404, detail="Guest not found")
    save_guests(updated)
    return {"message": "Guest deleted"}

# Delete: Remove all guests
@router.delete("/guests/clear")
def clear_guest_list():
    try:
        save_guests([])
        return {"status": "success", "message": "Guest list cleared."}
    except Exception as e:
        return {"status": "error", "message": str(e)}
