import json, struct, os
ASAR = os.path.expanduser("~/workspace/creatorize-teardown/unpacked/win/resources/app.asar")
OUT  = os.path.expanduser("~/workspace/heart-studio/app-linux/app")
data = open(ASAR, "rb").read()
header_size = struct.unpack("<I", data[4:8])[0]
json_len = struct.unpack("<I", data[12:16])[0]
header = json.loads(data[16:16+json_len])
data_start = 8 + header_size
count = 0; total = 0; unpacked = []
def walk(node, rel):
    global count, total
    for name, e in node.get("files", {}).items():
        r = f"{rel}/{name}" if rel else name
        if "files" in e: walk(e, r)
        elif e.get("unpacked"): unpacked.append(r)
        else:
            off = data_start + int(e["offset"]); size = int(e["size"])
            blob = data[off:off+size]
            assert len(blob) == size, r
            dest = os.path.join(OUT, r)
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            open(dest, "wb").write(blob)
            count += 1; total += size
walk(header, "")
print(f"extracted {count} files, {total} bytes -> {OUT}")
print(f"entries marked unpacked (live outside asar in app.asar.unpacked/): {len(unpacked)}")
for u in unpacked[:15]: print("  unpacked:", u)
