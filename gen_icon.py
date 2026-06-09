from PIL import Image, ImageDraw, ImageFont
import math

def create_bgmi_icon(size=512):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background - dark circle with gradient effect
    center = size // 2
    radius = int(size * 0.45)
    
    # Draw circular background
    for r in range(radius, 0, -1):
        t = r / radius
        # Dark red to dark gradient
        red = int(20 + (255 - 20) * (1 - t) * 0.3)
        green = int(10 + (70 - 10) * (1 - t) * 0.2)
        blue = int(15 + (85 - 15) * (1 - t) * 0.2)
        alpha = 255
        draw.ellipse([center-r, center-r, center+r, center+r], fill=(red, green, blue, alpha))
    
    # Border ring - neon red/orange
    for i in range(4):
        r = radius - i
        draw.ellipse([center-r, center-r, center+r, center+r], outline=(255, 70 + i*10, 55 + i*10, 255))
    
    # Draw crosshair/aim pattern
    line_color = (255, 70, 85, 200)
    cross_size = int(size * 0.15)
    
    # Horizontal lines
    draw.rectangle([center - cross_size, center - 3, center + cross_size, center + 3], fill=line_color)
    # Vertical lines
    draw.rectangle([center - 3, center - cross_size, center + 3, center + cross_size], fill=line_color)
    
    # Corner brackets (like BGMI aim)
    bracket_len = int(size * 0.12)
    bracket_gap = int(size * 0.08)
    bracket_w = 3
    bracket_color = (0, 212, 255, 230)
    
    # Top-left
    draw.rectangle([center-bracket_gap-bracket_len, center-bracket_gap, center-bracket_gap, center-bracket_gap+bracket_w], fill=bracket_color)
    draw.rectangle([center-bracket_gap, center-bracket_gap-bracket_len, center-bracket_gap+bracket_w, center-bracket_gap], fill=bracket_color)
    
    # Top-right
    draw.rectangle([center+bracket_gap, center-bracket_gap, center+bracket_gap+bracket_len, center-bracket_gap+bracket_w], fill=bracket_color)
    draw.rectangle([center+bracket_gap-bracket_w, center-bracket_gap-bracket_len, center+bracket_gap, center-bracket_gap], fill=bracket_color)
    
    # Bottom-left
    draw.rectangle([center-bracket_gap-bracket_len, center+bracket_gap-bracket_w, center-bracket_gap, center+bracket_gap], fill=bracket_color)
    draw.rectangle([center-bracket_gap, center+bracket_gap, center-bracket_gap+bracket_w, center+bracket_gap+bracket_len], fill=bracket_color)
    
    # Bottom-right
    draw.rectangle([center+bracket_gap, center+bracket_gap-bracket_w, center+bracket_gap+bracket_len, center+bracket_gap], fill=bracket_color)
    draw.rectangle([center+bracket_gap-bracket_w, center+bracket_gap, center+bracket_gap, center+bracket_gap+bracket_len], fill=bracket_color)
    
    # Inner glow circle
    for i in range(3):
        r = int(size * 0.06) + i
        draw.ellipse([center-r, center-r, center+r, center+r], outline=(255, 215, 0, 180 - i*50))
    
    # Center dot
    draw.ellipse([center-5, center-5, center+5, center+5], fill=(255, 215, 0, 255))
    
    # Outer glow effect
    for i in range(5):
        r = radius + 5 + i * 3
        alpha = 100 - i * 20
        draw.ellipse([center-r, center-r, center+r, center+r], outline=(255, 70, 85, max(alpha, 0)))
    
    # Shield/armor shape overlay (subtle)
    shield_points = [
        (center, center - int(radius * 0.35)),
        (center + int(radius * 0.3), center - int(radius * 0.15)),
        (center + int(radius * 0.25), center + int(radius * 0.2)),
        (center, center + int(radius * 0.4)),
        (center - int(radius * 0.25), center + int(radius * 0.2)),
        (center - int(radius * 0.3), center - int(radius * 0.15)),
    ]
    draw.polygon(shield_points, outline=(255, 70, 85, 120), fill=None)
    
    return img

# Generate icons
for sz in [192, 512]:
    icon = create_bgmi_icon(sz)
    icon.save(f'/data/data/com.termux/files/home/bgmi-tournament/icon-{sz}.png')
    icon.save(f'/data/data/com.termux/files/home/bgmi-tournament/www/icon-{sz}.png')
    print(f'icon-{sz}.png saved ({sz}x{sz})')

print('Icons ready!')
