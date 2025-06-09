import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
django.setup()

from products.models import Product, Category

# Count objects
products_count = Product.objects.count()
categories_count = Category.objects.count()

print(f'Total products: {products_count}')
print(f'Total categories: {categories_count}')

if categories_count > 0:
    print('\nCategories:')
    for category in Category.objects.all():
        print(f'- {category.name} ({category.products.count()} products)')

if products_count > 0:
    print('\nSample Products:')
    for product in Product.objects.all()[:5]:  # Just show 5 sample products
        print(f'- {product.name} (${product.price}) - {product.category.name}')
else:
    print('\nNo products found in the database.')
    print('You can run generate_mock_data.py to create mock data.') 