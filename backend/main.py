from fastapi import FastAPI
from routes import table_calculator
from routes import seating_chart
from routes import seating_data
from fastapi.middleware.cors import CORSMiddleware
from routes import guest_list
from routes import auto_seating

app = FastAPI()

# 👇 CORS CONFIGURATION (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or use ["*"] during local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(guest_list.router, prefix="/api")
app.include_router(table_calculator.router, prefix="/api")
app.include_router(seating_chart.router, prefix="/api")
app.include_router(seating_data.router, prefix="/api")
app.include_router(auto_seating.router, prefix="/api")
