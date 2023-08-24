import json
from fastapi.encoders import jsonable_encoder
from fastapi import APIRouter, HTTPException, Request, WebSocketDisconnect
from fastapi.responses import JSONResponse
from typing import Dict, List, Optional
import uuid
from pydantic import BaseModel
from routers.data_manager import load_data, save_data
from routers.websocket_manager import room_websockets

router = APIRouter()

retro_data: Dict[str, Dict[str, List[Dict[str, str]]]
                 ] = load_data("retro_data.json")
admin_user_id: str = ""
current_retro_id = ''
projectName: str = ""
sprintNumber: str = ""


class User(BaseModel):
    displayName: str
    userId: str


class noteBM(User):
    noteId: str
    note: str
    actionType: str


@router.post("/create_retro")
async def create_retro(data: Optional[dict], request: Request):
    global current_retro_id
    retro_id = str(uuid.uuid4())
    global admin_user_id
    admin_user_id = request.headers.get('RS-U')

    retro_data[retro_id] = {"users": []}
    retro_data[retro_id] = {"projectName": data['projectName'],
                            "sprintNumber": data['sprintNumber'],
                            "displayName": data['displayName'],
                            "timer": "",
                            "users": [
                                {
                                    "userId": admin_user_id,
                                    "displayName": data['displayName'],
                                    "isAdmin":True
                                }],
                                "START_DOING": [],
                                "STOP_DOING": [],
                                "CONTINUE_DOING": []}

    save_data("retro_data.json", retro_data)
    current_retro_id = retro_id
    return {"retro_id": retro_id}


@router.post("/retro/{retro_id}/join")
async def join_room(retro_id: str, user_details: noteBM):
    if retro_id in retro_data:
        global admin_user_id
        is_admin = True if user_details.userId == admin_user_id else False
        retro_data[retro_id]['users'].append(
            {"userId": user_details.userId, "displayName": user_details.displayName, "isAdmin": is_admin})
        save_data("retro_data.json", retro_data)
        return retro_data[retro_id]['users'][-1]
    else:
        return JSONResponse(status_code=404, content={"error": "Room not found"})


@router.post("/retro/{retro_id}/store")
async def update_room_data(retro_id: str, data: noteBM):
    print(data, "Im insside tis api")
    if retro_id in room_websockets:
        print(retro_id, "RETRO")
        for web in room_websockets[retro_id]:
            try:
                await web['websocket'].send_json(jsonable_encoder(data))
            except WebSocketDisconnect:
                continue

    noteId = str(uuid.uuid4())

    try:
        with open('././retro_data.json', 'r') as f:
            json_data = json.load(f)

        if data.actionType == "START_DOING":
            category = "START_DOING"
        elif data.actionType == "STOP_DOING":
            category = "STOP_DOING"
        elif data.actionType == "CONTINUE_DOING":
            category = "CONTINUE_DOING"
        else:
            raise HTTPException(status_code=400, detail="Invalid action_Type")

        if retro_id not in retro_data:
            print("Not there")
            retro_data[retro_id] = {"START_DOING": [],
                                    "STOP_DOING": [], "CONTINUE_DOING": []}

        notes_list = retro_data[retro_id][category]
        notes_list.append({"noteId": noteId, "note": data.note,
                          "userId": data.userId, "userName": data.displayName})
        with open('././retro_data.json', 'w') as f:
            json.dump(retro_data, f, indent=4)

        print("Data appended to JSON")
    except Exception as e:
        print(f"Error appending new note to JSON: {e}")
    return {"response": data}


@router.get('/getalldata')
async def getData():
    global current_retro_id
    with open('././retro_data.json', 'r') as f:
        json_data = json.load(f)
    retro_id = current_retro_id
    return json_data[retro_id]

