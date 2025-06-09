import os
import django
import random

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
django.setup()

from products.models import Product

# Reliable image URLs by category
CATEGORY_IMAGES = {
    'Electronics': [
        'https://picsum.photos/400/400?random=1',
        'https://picsum.photos/400/400?random=2',
        'https://picsum.photos/400/400?random=3',
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop',
    ],
    'Clothing': [
        'https://picsum.photos/400/400?random=10',
        'https://picsum.photos/400/400?random=11',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    ],
    'Home & Kitchen': [
        'https://picsum.photos/400/400?random=20',
        'https://picsum.photos/400/400?random=21',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    ],
    'Books': [
        'https://picsum.photos/400/400?random=30',
        'https://picsum.photos/400/400?random=31',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=400&fit=crop',
    ],
    'Sports & Outdoors': [
        'https://picsum.photos/400/400?random=40',
        'https://picsum.photos/400/400?random=41',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1508355991726-e554c4e3ef1a?w=400&h=400&fit=crop',
    ],
    'Beauty & Personal Care': [
        'https://picsum.photos/400/400?random=50',
        'https://picsum.photos/400/400?random=51',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
    ],
    'Toys & Games': [
        'https://picsum.photos/400/400?random=60',
        'https://picsum.photos/400/400?random=61',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1515630278258-407f66498911?w=400&h=400&fit=crop',
    ],
    'Health & Wellness': [
        'https://picsum.photos/400/400?random=70',
        'https://picsum.photos/400/400?random=71',
        'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=400&fit=crop',
    ]
}

def update_product_images():
    print("Updating product images with reliable URLs...")
    
    updated_count = 0
    for product in Product.objects.all():
        category_name = product.category.name
        
        # Get reliable image for this category
        if category_name in CATEGORY_IMAGES:
            new_image = random.choice(CATEGORY_IMAGES[category_name])
        else:
            # Fallback to a generic image
            new_image = 'https://picsum.photos/400/400?random=100'
        
        # Update the product image
        product.image_url = new_image
        product.save()
        updated_count += 1
        print(f"Updated {product.name} -> {new_image}")
    
    print(f"\nSuccessfully updated {updated_count} products with new image URLs!")

if __name__ == "__main__":
    update_product_images() 