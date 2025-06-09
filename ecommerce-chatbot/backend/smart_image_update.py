import os
import django
import random
import re

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
django.setup()

from products.models import Product

# Smart image mapping based on product names
PRODUCT_TYPE_IMAGES = {
    # Electronics
    'smartphone': [
        'https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    ],
    'laptop': [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop',
    ],
    'headphones': [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
    ],
    'speaker': [
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    ],
    'camera': [
        'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
    ],
    'smartwatch': [
        'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=400&h=400&fit=crop',
    ],
    'tablet': [
        'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1585789575556-6ba3b89cb7e6?w=400&h=400&fit=crop',
    ],

    # Clothing
    't-shirt': [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    ],
    'jeans': [
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1475809913362-28a064062ccd?w=400&h=400&fit=crop',
    ],
    'dress': [
        'https://images.unsplash.com/photo-1566479179817-c1c3a5fe4b67?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1622556498246-755f44ca76f3?w=400&h=400&fit=crop',
    ],
    'shoes': [
        'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop',
    ],
    'jacket': [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400&h=400&fit=crop',
    ],
    'sweater': [
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop',
    ],
    'hat': [
        'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1514327153760-7ce9f3564c4d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
    ],

    # Home & Kitchen
    'blender': [
        'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop',
    ],
    'cookware': [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1584464218608-4deb641ba2fe?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556928045-6e6c0e9cd770?w=400&h=400&fit=crop',
    ],
    'coffee': [
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1508844001366-ad2181b6b2ab?w=400&h=400&fit=crop',
    ],
    'bedding': [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=400&h=400&fit=crop',
    ],

    # Books
    'fiction': [
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
    ],
    'cooking': [
        'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=400&fit=crop',
    ],
    'book': [
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
    ],

    # Default fallbacks by category
    'electronics_default': ['https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop'],
    'clothing_default': ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'],
    'home_default': ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'],
    'books_default': ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop'],
    'sports_default': ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'],
    'beauty_default': ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop'],
    'toys_default': ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'],
    'health_default': ['https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=400&fit=crop'],
}

def get_smart_image_url(product_name, product_id):
    """Get an appropriate image URL based on product name and category"""
    
    # Define category-specific images with better URLs
    category_images = {
        'smartphone': [
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1607936854279-55e8f4c64888?w=400&h=400&fit=crop',
        ],
        'laptop': [
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop',
        ],
        'speaker': [
            'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1582270558592-3b7b8afb6498?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop',
        ],
        'tablet': [
            'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&h=400&fit=crop',
        ],
        'camera': [
            'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1463917910396-c5c5c7b01de2?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1635496991810-d9ad7cc442f4?w=400&h=400&fit=crop',
        ],
        'headphone': [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop',
        ],
        'smartwatch': [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop',
        ],
        'fashion': [
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop',
        ],
        'home': [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop',
        ],
        'kitchen': [
            'https://images.unsplash.com/photo-1556909202-f6f2fb0605a8?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop',
        ]
    }
    
    # Determine category based on product name
    name_lower = product_name.lower()
    
    if any(word in name_lower for word in ['iphone', 'samsung', 'phone', 'smartphone', 'mobile']):
        category = 'smartphone'
    elif any(word in name_lower for word in ['macbook', 'laptop', 'computer', 'thinkpad', 'surface']):
        category = 'laptop'
    elif any(word in name_lower for word in ['speaker', 'bluetooth', 'echo', 'alexa', 'sound']):
        category = 'speaker'
    elif any(word in name_lower for word in ['ipad', 'tablet', 'kindle']):
        category = 'tablet'
    elif any(word in name_lower for word in ['camera', 'canon', 'nikon', 'sony', 'photo']):
        category = 'camera'
    elif any(word in name_lower for word in ['headphone', 'earphone', 'earbud', 'airpods', 'audio']):
        category = 'headphone'
    elif any(word in name_lower for word in ['watch', 'apple watch', 'smartwatch', 'wearable']):
        category = 'smartwatch'
    elif any(word in name_lower for word in ['shirt', 'dress', 'jeans', 'jacket', 'clothing', 'fashion', 'apparel']):
        category = 'fashion'
    elif any(word in name_lower for word in ['cookware', 'kitchen', 'pot', 'pan', 'utensil', 'knife', 'blender']):
        category = 'kitchen'
    else:
        category = 'home'  # Default fallback
    
    # Select image based on product ID to ensure consistency
    images = category_images[category]
    image_index = product_id % len(images)
    return images[image_index]

def update_product_images():
    """Update all product images with smart category-based URLs"""
    
    products = Product.objects.all()
    
    print(f"Updating images for {products.count()} products...")
    
    for product in products:
        new_image_url = get_smart_image_url(product.name, product.id)
        
        # Determine category for display purposes
        name_lower = product.name.lower()
        if any(word in name_lower for word in ['iphone', 'samsung', 'phone', 'smartphone', 'mobile']):
            category = 'smartphone'
        elif any(word in name_lower for word in ['macbook', 'laptop', 'computer', 'thinkpad', 'surface']):
            category = 'laptop'
        elif any(word in name_lower for word in ['speaker', 'bluetooth', 'echo', 'alexa', 'sound']):
            category = 'speaker'
        elif any(word in name_lower for word in ['ipad', 'tablet', 'kindle']):
            category = 'tablet'
        elif any(word in name_lower for word in ['camera', 'canon', 'nikon', 'sony', 'photo']):
            category = 'camera'
        elif any(word in name_lower for word in ['headphone', 'earphone', 'earbud', 'airpods', 'audio']):
            category = 'headphone'
        elif any(word in name_lower for word in ['watch', 'apple watch', 'smartwatch', 'wearable']):
            category = 'smartwatch'
        elif any(word in name_lower for word in ['shirt', 'dress', 'jeans', 'jacket', 'clothing', 'fashion', 'apparel']):
            category = 'fashion'
        elif any(word in name_lower for word in ['cookware', 'kitchen', 'pot', 'pan', 'utensil', 'knife', 'blender']):
            category = 'kitchen'
        else:
            category = 'home'
        
        product.image_url = new_image_url
        product.save()
        print(f"Updated {product.name} -> {category} -> {new_image_url}")
    
    print("All product images updated successfully!")

if __name__ == "__main__":
    update_product_images() 