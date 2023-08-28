import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.rooms_manager import router as room_router
from routers.websocket_manager import router as websocket_router
from routers.time_manager import router as time_router

# Define the URLs you want to accept cross-origin requests from.
origins = [
    "http://localhost:4200",
]

# Configure logging to output at the INFO level
logging.basicConfig(level=logging.INFO)

# Instantiate the FastAPI application
app = FastAPI()

# Include the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#Include routers below
app.include_router(room_router)
app.include_router(websocket_router)
app.include_router(time_router)



