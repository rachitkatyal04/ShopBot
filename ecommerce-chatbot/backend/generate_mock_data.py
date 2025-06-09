import os
import django
import random
from faker import Faker

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
django.setup()

from products.models import Category, Product

fake = Faker()

# Create categories
categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Books",
    "Sports & Outdoors",
    "Beauty & Personal Care",
    "Toys & Games",
    "Health & Wellness"
]

# Reliable image URLs by category
CATEGORY_IMAGES = {
    "Electronics": [
        "https://picsum.photos/400/400?random=1",
        "https://picsum.photos/400/400?random=2",
        "https://picsum.photos/400/400?random=3",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",  # Electronics
        "https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=400&h=400&fit=crop",  # Phone
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",  # Laptop
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",  # Headphones
        "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=400&fit=crop",  # Camera
    ],
    "Clothing": [
        "https://picsum.photos/400/400?random=10",
        "https://picsum.photos/400/400?random=11",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",  # Clothing store
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop",  # Clothes
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",  # T-shirt
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop",  # Shoes
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",  # Jeans
    ],
    "Home & Kitchen": [
        "https://picsum.photos/400/400?random=20",
        "https://picsum.photos/400/400?random=21",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",  # Kitchen
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=400&fit=crop",  # Kitchen items
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",  # Home decor
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",  # Furniture
    ],
    "Books": [
        "https://picsum.photos/400/400?random=30",
        "https://picsum.photos/400/400?random=31",
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",  # Books
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",  # Book
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",  # Books stack
        "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=400&fit=crop",  # Open book
    ],
    "Sports & Outdoors": [
        "https://picsum.photos/400/400?random=40",
        "https://picsum.photos/400/400?random=41",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",  # Sports
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop",  # Running
        "https://images.unsplash.com/photo-1508355991726-e554c4e3ef1a?w=400&h=400&fit=crop",  # Fitness
    ],
    "Beauty & Personal Care": [
        "https://picsum.photos/400/400?random=50",
        "https://picsum.photos/400/400?random=51",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",  # Beauty
        "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop",  # Cosmetics
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",  # Skincare
    ],
    "Toys & Games": [
        "https://picsum.photos/400/400?random=60",
        "https://picsum.photos/400/400?random=61",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",  # Toys
        "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=400&fit=crop",  # Blocks
        "https://images.unsplash.com/photo-1515630278258-407f66498911?w=400&h=400&fit=crop",  # Games
    ],
    "Health & Wellness": [
        "https://picsum.photos/400/400?random=70",
        "https://picsum.photos/400/400?random=71",
        "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=400&fit=crop",  # Health
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",  # Wellness
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=400&fit=crop",  # Vitamins
    ]
}

def get_random_image_for_category(category_name):
    """Get a random image URL for the given category"""
    images = CATEGORY_IMAGES.get(category_name, CATEGORY_IMAGES["Electronics"])
    return random.choice(images)

def generate_mock_data():
    print("Generating mock data...")
    
    # Create categories
    created_categories = []
    for category_name in categories:
        category, created = Category.objects.get_or_create(name=category_name)
        created_categories.append(category)
        if created:
            print(f"Created category: {category_name}")
        else:
            print(f"Category already exists: {category_name}")
    
    # Create products
    product_count = Product.objects.count()
    if product_count >= 100:
        print(f"Already have {product_count} products. Skipping product creation.")
        return
    
    products_to_create = 100 - product_count
    print(f"Creating {products_to_create} products...")
    
    for _ in range(products_to_create):
        category = random.choice(created_categories)
        
        # Generate product data based on category
        if category.name == "Electronics":
            name = f"{fake.word().capitalize()} {random.choice(['Smartphone', 'Laptop', 'Headphones', 'Tablet', 'Smartwatch', 'Camera', 'Speaker'])}"
            description = f"A high-quality {name.lower()} with advanced features. {fake.sentence(nb_words=20)}"
            price = round(random.uniform(99.99, 1999.99), 2)
            
        elif category.name == "Clothing":
            clothing_type = random.choice(['T-shirt', 'Jeans', 'Dress', 'Jacket', 'Sweater', 'Shoes', 'Hat'])
            name = f"{fake.word().capitalize()} {clothing_type}"
            description = f"Stylish and comfortable {name.lower()}. {fake.sentence(nb_words=15)}"
            price = round(random.uniform(19.99, 199.99), 2)
            
        elif category.name == "Home & Kitchen":
            item_type = random.choice(['Blender', 'Coffee Maker', 'Toaster', 'Cookware Set', 'Knife Set', 'Bedding', 'Furniture'])
            name = f"{fake.word().capitalize()} {item_type}"
            description = f"Essential {name.lower()} for your home. {fake.sentence(nb_words=15)}"
            price = round(random.uniform(29.99, 499.99), 2)
            
        elif category.name == "Books":
            genre = random.choice(['Fiction', 'Non-fiction', 'Biography', 'Science', 'History', 'Self-help', 'Cooking'])
            name = f"The {fake.word().capitalize()} {genre}"
            description = f"A captivating {genre.lower()} book that will keep you engaged. {fake.sentence(nb_words=20)}"
            price = round(random.uniform(9.99, 39.99), 2)
            
        else:
            name = f"{fake.word().capitalize()} {fake.word().capitalize()}"
            description = fake.paragraph(nb_sentences=5)
            price = round(random.uniform(9.99, 999.99), 2)
        
        # Get image URL for this category
        image_url = get_random_image_for_category(category.name)
        
        # Create the product
        product = Product.objects.create(
            name=name,
            description=description,
            price=price,
            category=category,
            image_url=image_url,
            stock=random.randint(0, 100)
        )
        print(f"Created product: {product.name} in category {category.name}")

if __name__ == "__main__":
    generate_mock_data() 