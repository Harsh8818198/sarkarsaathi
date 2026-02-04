from PIL import Image, ImageDraw, ImageFont
import os

# Create icons directory if it doesn't exist
os.makedirs('icons', exist_ok=True)

# Define sizes
sizes = [16, 48, 128]

for size in sizes:
    # Create a new image with gradient background
    img = Image.new('RGB', (size, size), color='#667eea')
    draw = ImageDraw.Draw(img)
    
    # Draw a circle
    margin = size // 8
    draw.ellipse([margin, margin, size-margin, size-margin], fill='#764ba2', outline='white', width=max(1, size//32))
    
    # Add flag emoji (simplified - just use colors)
    # Orange, white, green stripes
    stripe_height = size // 6
    draw.rectangle([margin*2, size//3, size-margin*2, size//3 + stripe_height], fill='#FF9933')
    draw.rectangle([margin*2, size//2 - stripe_height//2, size-margin*2, size//2 + stripe_height//2], fill='white')
    draw.rectangle([margin*2, size*2//3 - stripe_height, size-margin*2, size*2//3], fill='#138808')
    
    # Save
    img.save(f'icons/icon{size}.png')
    print(f'Created icon{size}.png')

print('All icons created successfully!')
