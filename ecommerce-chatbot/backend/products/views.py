from django.shortcuts import render
from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'price']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    lookup_field = 'slug'
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Search products by query parameter
        """
        query = request.query_params.get('q', '')
        if query:
            products = self.queryset.filter(name__icontains=query) | self.queryset.filter(description__icontains=query)
            serializer = self.get_serializer(products, many=True)
            return Response(serializer.data)
        return Response([])
    
    @action(detail=False, methods=['get'])
    def recommended(self, request):
        """
        Get recommended products (for demo, just returns top 5 products)
        """
        products = self.queryset.order_by('-created_at')[:5]
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
