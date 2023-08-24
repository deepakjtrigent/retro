from fastapi import APIRouter, WebSocket,WebSocketDisconnect

router = APIRouter()

room_websockets = {}

@router.websocket("/retro/{retro_id}")
async def websocket_endpoint(retro_id: str, websocket: WebSocket):
    await websocket.accept()
    
    if retro_id not in room_websockets:
        room_websockets[retro_id] = []
    room_websockets[retro_id].append({"websocket": websocket})
    try:
        while True:
            data = await websocket.receive_text() 
            for web in room_websockets.get(retro_id, []):
                if web != websocket:
                    await web['websocket'].send_text(data)
                    
    except WebSocketDisconnect:
        room_websockets[retro_id] = [web for web in room_websockets[retro_id] if web['websocket'] != websocket]