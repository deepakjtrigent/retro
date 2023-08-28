from fastapi import APIRouter, WebSocket,WebSocketDisconnect
import json
import asyncio
router = APIRouter()

room_websockets = {}
timer_loops={}
timer_semaphores={}

async def timer_loop(retro_id):
    while True:
        async with timer_semaphores[retro_id]:
            if retro_id in timer_loops and timer_loops[retro_id]['timer_active'] and timer_loops[retro_id]['remaining_time'] > 0:
                await asyncio.sleep(1)
                timer_loops[retro_id]['remaining_time'] -= 1
                for web_data in room_websockets.get(retro_id, []):
                    web_socket = web_data['websocket']
                    remaining_time = timer_loops[retro_id]['remaining_time']
                    minutes = remaining_time // 60
                    seconds = remaining_time % 60
                    timer_message = {"actionType": "timer_left", "timeleft": f"{minutes:02d}:{seconds:02d}"}
                    await web_socket.send_text(json.dumps(timer_message))
            else:
                await asyncio.sleep(1)

def start_timer_loop(retro_id):
    if retro_id not in timer_loops:
        timer_loops[retro_id] = {'timer_active': False, 'remaining_time': 0}
        timer_semaphores[retro_id] = asyncio.Semaphore(1)
    
    if not timer_loops[retro_id]['timer_active']:
        timer_loops[retro_id]['remaining_time'] = 10 * 60
        timer_loops[retro_id]['timer_active'] = True
        asyncio.create_task(timer_loop(retro_id))

@router.websocket("/retro/{retro_id}")
async def websocket_endpoint(retro_id: str, websocket: WebSocket):
    await websocket.accept()
    
    if retro_id not in room_websockets:
        room_websockets[retro_id] = []
    room_websockets[retro_id].append({"websocket": websocket})
    start_timer_loop(retro_id)
    try:
        while True:
            data = await websocket.receive_text() 
            for web in room_websockets.get(retro_id, []):
                if web != websocket:
                    await web['websocket'].send_text(data)
                    
    except WebSocketDisconnect:
        room_websockets[retro_id] = [web for web in room_websockets[retro_id] if web['websocket'] != websocket]