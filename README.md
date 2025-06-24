# Wedding Planner Application

# Wedding Seating Chart App

An interactive wedding seating chart planner built with React, React-Konva, and Bootstrap on the frontend, and FastAPI on the backend. This tool allows users to manage guests, generate seating charts, create floor plans, and calculate tables/seats based on guest count.

## Features

- Upload or manually enter guest lists (with tags and groups)
- Automatically calculate table arrangements based on guest count
- Create round or rectangle tables with configurable seat counts
- Visual floor plan canvas powered by React-Konva
- Modal editor for table properties and guest assignments
- Persist and load saved layouts using FastAPI
- Support for mix of auto-generated and manual arrangements

## Tech Stack

**Frontend**:
- React
- React-Konva (canvas rendering)
- Bootstrap (styling)
- Axios (API requests)

**Backend**:
- FastAPI (Python)
- JSON (storage)
- CORS (security) 
  
## Installation

### Backend
- cd /path/to/backend
- python -m venv venv
- --source venv/bin/activate  # or venv\Scripts\activate on Windows
- pip install -r requirements.txt
- uvicorn main:app --reload

### Frontend 
- cd /path/to/frontend
- npm install
- npm install react
- npm install react-konva
- npm install react-bootstrap bootstrap
- npm start

## Usage
- Import or manually enter your guest list.
- Use the Table Calculator to calculate numeber of tables needed based on shapes, seats per table, and guest count.
- Generate or manually add tables to the canvas.
- Drag guests onto seating chart.
- Click on tables to rename, update seat count, or manually edit guests.
- Save the layout and return anytime to update.
