import struct, zlib

def create_png(size, bg_color=(10,10,15), accent=(255,70,85)):
    pixels = []
    center = size // 2
    radius = size * 0.4
    
    for y in range(size):
        row = []
        for x in range(size):
            dx = x - center
            dy = y - center
            dist = (dx*dx + dy*dy) ** 0.5
            
            if dist < radius:
                t = dist / radius
                r = int(accent[0] * (1-t) + bg_color[0] * t)
                g = int(accent[1] * (1-t) + bg_color[1] * t)
                b = int(accent[2] * (1-t) + bg_color[2] * t)
                row.extend([r, g, b, 255])
            elif dist < radius + 3:
                row.extend([accent[0], accent[1], accent[2], 255])
            else:
                row.extend([bg_color[0], bg_color[1], bg_color[2], 0])
        pixels.append(bytes([0] + row))
    
    raw = b''.join(pixels)
    
    def chunk(chunk_type, data):
        c = chunk_type + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    
    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)
    idat = zlib.compress(raw, 9)
    
    return sig + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')

for size in [192, 512]:
    png = create_png(size)
    with open(f'/data/data/com.termux/files/home/bgmi-tournament/www/icon-{size}.png', 'wb') as f:
        f.write(png)
    print(f'icon-{size}.png created ({len(png)} bytes)')

print('Done!')
