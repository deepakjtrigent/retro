from tinydb import TinyDB, Query, where


db = TinyDB('retro_data_db.json')


def save_data_in_db(data_to_be_stored, document_name: str):
    rooms = db.table(document_name)
    rooms.insert(data_to_be_stored)


def update_data_in_db(data_to_be_stored, retro_id: str, category :str):
    rooms = db.table('rooms')
    Room = Query()
    room_list = rooms.search(Room.retroId == retro_id)
    room_list[0][category].append(data_to_be_stored)
    rooms.upsert(room_list[0],  Room.retroId == retro_id)


def delete_users(retro_id: str, user_id: str):
    rooms = db.table('rooms')
    Room = Query()
    room_list = rooms.search(Room.retroId == retro_id)
    user_index = next((index for (index, user) in enumerate(
        room_list[0]['users']) if user['userId'] == user_id), None)
    del room_list[0]['users'][user_index]
    rooms.upsert(room_list[0], Room.retroId == retro_id)


def delete_room(retro_id: str):
    rooms = db.table('rooms')
    Room = Query()
    room_list = rooms.search(Room.retroId == retro_id)
    if len(room_list[0]['users']) == 0:
        rooms.remove(where('retroId') == retro_id)
