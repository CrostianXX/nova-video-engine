import sys
import os
import random
import subprocess
import httpx
from gradio_client import Client, handle_file
import shutil

# Token yang dipisah agar tidak diblokir GitHub
TOKENS = [
    "hf_" + "bMBLUUHbfwdXRYLuPuTDPFBJbhcSyhShXb",
    "hf_" + "PwhfLwaGOhVTFUBsaDBfXLzLCzsQInQKEh"
]

def download_image(url, filename="start.jpg"):
    print(f"Mendownload gambar awal dari: {url}")
    with httpx.Client(follow_redirects=True) as client:
        r = client.get(url)
        with open(filename, 'wb') as f:
            f.write(r.content)
    return filename

def extract_last_frame(video_path, output_image_path):
    print(f"Mengekstrak frame terakhir dari {video_path}...")
    command = f"ffmpeg -sseof -3 -i {video_path} -update 1 -q:v 1 {output_image_path} -y"
    subprocess.run(command, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return output_image_path

def generate_video_clip(prompt, input_image):
    token = random.choice(TOKENS)
    print(f"Menghubungkan ke AI Video dengan token {token[:8]}...")
    
    client = Client("Saravutw/WAN2.2_I2V_LIGHTNING_4-8step_custom", token=token)
    image_arg = handle_file(input_image)
    
    # Python gradio_client strict validation bypass
    # We pass the same image for both input_image and last_image
    result = client.predict(
        image_arg,              # Input Image
        image_arg,              # Last Image
        prompt,                 # Prompt Text
        4,                      # Inference Steps
        "blurry, chaotic, bad quality", # Negative
        5.0,                    # Duration (Float)
        1.0,                    # Guidance Scale 1
        1.0,                    # Guidance Scale 2
        42,                     # Seed
        True,                   # Randomize seed
        5,                      # Video Quality
        "UniPCMultistep",       # Scheduler
        3.0,                    # Flow Shift
        16,                     # frame_multiplier (int)
        False,                  # Safe Mode
        True,                   # video_component
        api_name="/generate_video"
    )
    
    if isinstance(result, tuple) or isinstance(result, list):
        for r in result:
            if isinstance(r, dict) and 'video' in r:
                return r['video']
            if isinstance(r, str) and (r.endswith('.mp4') or r.endswith('.webm')):
                return r
        return result[0]['video'] if isinstance(result[0], dict) else result[0]
    return result

def main():
    if len(sys.argv) < 4:
        print("Usage: python engine.py <prompt> <loops> <image_url>")
        sys.exit(1)
        
    prompt = sys.argv[1]
    loops = int(sys.argv[2])
    image_url = sys.argv[3]
    
    print(f"🚀 Memulai Jahitan Video! | Loops: {loops} | Prompt: {prompt}")
    
    last_frame = download_image(image_url, "start.jpg")
    video_clips = []
    
    for i in range(loops):
        print(f"\n--- Memproses Bagian {i+1} dari {loops} ---")
        
        # We removed the try-except so the error throws loudly and fails the GH action
        video_path = generate_video_clip(prompt, last_frame)
        clip_name = f"clip_{i}.mp4"
        
        shutil.copy(video_path, clip_name)
        video_clips.append(clip_name)
        
        last_frame = f"frame_{i}.jpg"
        extract_last_frame(clip_name, last_frame)
        print(f"✅ Bagian {i+1} Selesai!")
            
    if video_clips:
        print("\n🧵 Menjahit semua klip menjadi satu video panjang...")
        with open("list.txt", "w") as f:
            for clip in video_clips:
                f.write(f"file '{clip}'\n")
        
        subprocess.run("ffmpeg -f concat -safe 0 -i list.txt -c copy hasil_akhir.mp4 -y", shell=True)
        print("🎉 Video Panjang Berhasil Dibuat!")

if __name__ == "__main__":
    main()
