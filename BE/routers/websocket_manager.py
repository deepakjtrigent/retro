from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import asyncio

from tinydb import Query, TinyDB
router = APIRouter()

room_websockets = {}
timer_loops = {}
timer_semaphores = {}


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
                    timer_message = {"actionType": "timer_left",
                                     "timeleft": f"{minutes:02d}:{seconds:02d}"}
                    await web_socket.send_text(json.dumps(timer_message))
            else:
                await asyncio.sleep(1)


async def send_message(retro_id: str, websocket, user_id: str, actionType: str):
    db = TinyDB('retro_data_db.json')
    rooms = db.table('rooms')
    Room = Query()
    Users = Query()
    if rooms.contains(Room.users.any(Users.userId == user_id) & (Room.retroId == retro_id)):
        retro_room_data = rooms.search(Room.users.any(
            Users.userId == user_id) & (Room.retroId == retro_id))[0]
        users = retro_room_data['users']
        user_index = next((index for (index, user) in enumerate(
            users) if user['userId'] == user_id), None)
        for web in room_websockets.get(retro_id, []):
            if actionType == "NEW_USER_DATA":
                if web["websocket"] == websocket:
                    await web['websocket'].send_text(json.dumps({"actionType": "RETRO_DATA", "retroData": retro_room_data}))
                else:
                    await web['websocket'].send_text(json.dumps({"actionType": actionType, "userData": users[user_index]}))
            elif actionType == "USER_LEFT" and web['websocket'] != websocket:
                await web['websocket'].send_text(json.dumps({"actionType": actionType, "userData": users[user_index]}))


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
    user_id = ''
    if retro_id not in room_websockets:
        room_websockets[retro_id] = []
    room_websockets[retro_id].append({"websocket": websocket, user_id: ""})
    start_timer_loop(retro_id)
    try:
        while True:
            user_id_dict = json.loads(await websocket.receive_text())
            if 'userId' in user_id_dict:
                user_id = user_id_dict['userId']
                for websocket_data in room_websockets[retro_id]:
                    if websocket_data['websocket'] == websocket:
                        websocket_data['user_id'] = user_id
                        await send_message(retro_id, websocket, user_id, "NEW_USER_DATA")

    except WebSocketDisconnect:
        room_websockets[retro_id] = [
            web for web in room_websockets[retro_id] if web['websocket'] != websocket]
