import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


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
