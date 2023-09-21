import json
from fastapi.encoders import jsonable_encoder
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from typing import Dict, List, Optional
import uuid
from pydantic import BaseModel
from tinydb import Query, TinyDB, where
from routers.data_manager import save_data_in_db, update_data_in_db
from routers.websocket_manager import room_websockets

router = APIRouter()


# class Sample(BaseModel):
#     projectName: str
#     sprintNumber: str
#     displayName: str


class User(BaseModel):
    displayName: str
    userId: str


class Note(User):
    noteId: str
    note: str
    actionType: str


@router.post("/create_retro")
async def create_retro(data: Optional[dict]):
    retro_id = str(uuid.uuid4())
    retro_data = {
        "retroId": retro_id,
        "projectName": data['projectName'],
        "sprintNumber": data['sprintNumber'],
        "displayName": data['displayName'],
        "timer": "",
        "users": [],
        "START_DOING": [],
        "STOP_DOING": [],
        "CONTINUE_DOING": []}

    save_data_in_db(retro_data, 'rooms')
    return {"retro_id": retro_id}


@router.post("/retro/{retro_id}/join")
async def join_room(retro_id: str, user_details: User):
    db = TinyDB('retro_data_db.json')
    retro_rooms = db.table('rooms')
    Room = Query()
    Users = Query()
    if retro_rooms.contains(Room.retroId == retro_id):
        if not retro_rooms.contains((Room.users.any(Users.userId == user_details.userId)) & (Room.retroId == retro_id)):
            users_in_retro_room = retro_rooms.search(
                where('retroId') == retro_id)[0]['users']
            user_to_be_stored = {"userId": user_details.userId, "displayName": user_details.displayName,
                                 "isAdmin": True if not len(users_in_retro_room) else False}
            update_data_in_db(user_to_be_stored, retro_id, 'users')
            return user_to_be_stored
        else:
            return JSONResponse(status_code=403, content={"error": "User is already in the room"})
    else:
        return JSONResponse(status_code=404, content={"error": "Room not found"})


@router.post("/retro/{retro_id}/store")
async def update_room_data(retro_id: str, data: Note):
    db = TinyDB('retro_data_db.json')
    retro_rooms = db.table('rooms')
    Room = Query()
    Users = Query()
    if retro_rooms.contains(Room.retroId == retro_id):
        if retro_rooms.contains(Room.users.any(Users.userId == data.userId)):
            noteId = str(uuid.uuid4())
            if data.actionType == "START_DOING":
                category = "START_DOING"
            elif data.actionType == "STOP_DOING":
                category = "STOP_DOING"
            elif data.actionType == "CONTINUE_DOING":
                category = "CONTINUE_DOING"
            else:
                raise HTTPException(
                    status_code=400, detail="Invalid action_Type")
            category_data = retro_rooms.search(
                where('retroId') == retro_id)[0][category]
            category_data.append({"noteId": noteId, "note": data.note,
                                  "userId": data.userId, "userName": data.displayName})
            update_data_in_db(category_data, retro_id, category)
            for web in room_websockets[retro_id]:
                await web['websocket'].send_text(json.dumps(jsonable_encoder(data)))
            return {"response": data}
        else:
            raise HTTPException(status_code=402, detail="User does not exist")
    else:
        raise HTTPException(status_code=404, detail="Room does not exist")
