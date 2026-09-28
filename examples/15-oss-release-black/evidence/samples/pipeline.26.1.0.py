import json


def load(path):
    with open(path) as f:
        return json.load(f)


result = load("data.json")
x = y = 0
