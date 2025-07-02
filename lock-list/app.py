from flask import Flask, request, abort, jsonify

app = Flask(__name__)
LOCK_FILE = '/lockdata/lock_list.txt'

def load_locked_ids():
    try:
        with open(LOCK_FILE, 'r') as f:
            return set(line.strip() for line in f if line.strip())
    except FileNotFoundError:
        return set()

def save_locked_ids(ids):
    with open(LOCK_FILE, 'w') as f:
        f.writelines(f"{_id}\n" for _id in ids)

@app.route('/lock_status/<worker_id>', methods=['GET'])
def lock_status(worker_id):
    locked = load_locked_ids()
    if worker_id in locked:
        abort(401)
    return "OK", 200

@app.route('/lock/<worker_id>', methods=['POST'])
def lock(worker_id):
    ids = load_locked_ids()
    ids.add(worker_id)
    save_locked_ids(ids)
    return jsonify({"locked": list(ids)}), 201

@app.route('/lock/<worker_id>', methods=['DELETE'])
def unlock(worker_id):
    ids = load_locked_ids()
    ids.discard(worker_id)
    save_locked_ids(ids)
    return jsonify({"locked": list(ids)}), 200

@app.route('/lock', methods=['GET'])
def list_locked():
    return jsonify({"locked": list(load_locked_ids())})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=61337)
