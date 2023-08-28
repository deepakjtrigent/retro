import asyncio
from fastapi import APIRouter
from routers.websocket_manager import timer_loops,timer_loop

router = APIRouter()

@router.post("/start_timer/{retro_id}")
async def start_timer(retro_id: str):
    if retro_id in timer_loops and not timer_loops[retro_id]['timer_active']:
        timer_loops[retro_id]['timer_active'] = True
        asyncio.create_task(timer_loop(retro_id))
        return {"message": f"Timer resumed for retro_id {retro_id}"}
    else:
        return {"message": f"Timer is already active for retro_id {retro_id}"}

@router.post("/stop_timer/{retro_id}")
async def stop_timer(retro_id: str):
    if retro_id in timer_loops and timer_loops[retro_id]['timer_active']:
        timer_loops[retro_id]['timer_active'] = False
        return {"message": f"Timer paused for retro_id {retro_id}"}
    else:
        return {"message": f"No active timer found for retro_id {retro_id}"}