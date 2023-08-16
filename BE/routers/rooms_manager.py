import uuid
from fastapi import APIRouter
from routers.data_manager import save_data, load_data
from typing import Dict, List


router = APIRouter()
retro_data: Dict[str, Dict[str, List[Dict[str, str]]]
                 ] = load_data("retro_data.json")


@router.post("/create_retro")
async def create_retro():
    retro_id = str(uuid.uuid4())
    retro_data[retro_id] = {"users": []}
    save_data("retro_data.json", retro_data)
    return {"retro_id": retro_id}
