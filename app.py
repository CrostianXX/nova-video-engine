from fastapi import FastAPI, BackgroundTasks
import subprocess
import os

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "NOVA Video Engine is RUNNING 🚀", "ffmpeg_installed": os.path.exists("/usr/bin/ffmpeg")}

@app.get("/ping")
def ping():
    return "pong"

# Nanti kita akan isi ini dengan logika Video Chaining 30 detik!
# Tapi sekarang kita upload versi dasar ini dulu biar Render-nya menyala.
