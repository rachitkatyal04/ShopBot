"""
URL configuration for ecommerce_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from products.views import ProductViewSet, CategoryViewSet
from chatbot.views import ChatSessionViewSet, ChatMessageViewSet
from users.views import RegisterView, UserProfileView, LogoutView

def api_info(request):
    """Simple API info page"""
    return JsonResponse({
        'message': 'E-commerce Chatbot API',
        'version': '1.0.0',
        'endpoints': {
            'products': '/api/products/',
            'categories': '/api/categories/',
            'chat_sessions': '/api/chat-sessions/',
            'authentication': {
                'register': '/api/register/',
                'login': '/api/token/',
                'refresh': '/api/token/refresh/',
                'profile': '/api/profile/',
                'logout': '/api/logout/',
            },
            'admin': '/admin/',
        }
    })

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'chat-sessions', ChatSessionViewSet, basename='chat-session')
router.register(r'chat-messages', ChatMessageViewSet, basename='chat-message')

urlpatterns = [
    path('', api_info, name='api_info'),  # Root API info page
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # Authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/profile/', UserProfileView.as_view(), name='profile'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
