import json

def load_data(filename):
    try:
        with open(filename, 'r') as file:
            data = file.read()
            if data.strip():
                return json.loads(data)
            else:
                return {}
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError:
        return {}


def save_data(filename, data):
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4)
        file.write("\n")