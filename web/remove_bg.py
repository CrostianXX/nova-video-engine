import sys
from PIL import Image
import numpy as np

def remove_bg(in_path, out_path):
    print(f"Processing: {in_path}")
    img = Image.open(in_path).convert('RGBA')
    data = np.array(img).astype(float)
    
    # 1. Identify true background color by sampling the edges
    border_pixels = np.concatenate([data[0, :, :3], data[-1, :, :3], data[:, 0, :3], data[:, -1, :3]])
    bg_color = np.median(border_pixels, axis=0)
    
    r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
    
    # 2. Calculate distance of each pixel from the background color
    dist = np.sqrt((r - bg_color[0])**2 + (g - bg_color[1])**2 + (b - bg_color[2])**2)
    
    # 3. Calculate Alpha (Transparency)
    # threshold_low: pixels closer than this to bg become completely transparent (0)
    # threshold_high: pixels further than this become completely opaque (255)
    threshold_low = 25
    threshold_high = 120
    
    alpha = np.clip((dist - threshold_low) / (threshold_high - threshold_low), 0, 1) * 255
    
    # 4. Remove dark halo effect on white backgrounds!
    # A glowing object on a black background has dark pixels (low RGB values).
    # If we put these dark pixels with semi-transparency on a white background, they look gray/dirty.
    # We fix this by extracting the pure color (chromaticity) and boosting it to maximum brightness.
    # The alpha channel will handle the fading instead of the darkness of the pixel.
    intensity = np.maximum(np.maximum(r, g), np.maximum(b, 1))
    
    # Prevent division by zero and boost colors
    r_boosted = np.clip((r / intensity) * 255, 0, 255)
    g_boosted = np.clip((g / intensity) * 255, 0, 255)
    b_boosted = np.clip((b / intensity) * 255, 0, 255)
    
    # We only want to boost the semi-transparent "glow" pixels. 
    # For fully opaque pixels (the core of the logo), we can keep their original color or blend it.
    # Let's blend between the original color (for core) and the boosted color (for glow) based on intensity.
    core_mask = np.clip((intensity - 100) / 100, 0, 1) # 1.0 for bright pixels, 0.0 for dark glow
    
    data[:,:,0] = r * core_mask + r_boosted * (1 - core_mask)
    data[:,:,1] = g * core_mask + g_boosted * (1 - core_mask)
    data[:,:,2] = b * core_mask + b_boosted * (1 - core_mask)
    data[:,:,3] = alpha
    
    out_img = Image.fromarray(data.astype(np.uint8), 'RGBA')
    out_img.save(out_path)
    print(f"Saved optimized logo to: {out_path}")

if __name__ == '__main__':
    in_file = sys.argv[1]
    out_file = sys.argv[2]
    remove_bg(in_file, out_file)
