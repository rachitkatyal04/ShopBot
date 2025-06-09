from django.shortcuts import render
import uuid
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import ChatSession, ChatMessage
from .serializers import ChatSessionSerializer, ChatMessageSerializer, ChatMessageCreateSerializer
from products.models import Product, Category

# Create your views here.

class ChatSessionViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSessionSerializer
    permission_classes = [permissions.AllowAny]  # Allow any user to access the chatbot
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return ChatSession.objects.filter(user=user).order_by('-updated_at')
        # For anonymous users, return sessions by session ID if provided
        session_id = self.request.query_params.get('session_id')
        if session_id:
            return ChatSession.objects.filter(session_id=session_id)
        return ChatSession.objects.none()
    
    def perform_create(self, serializer):
        # Generate unique session ID
        session_id = str(uuid.uuid4())
        
        # If user is authenticated, associate the session with them
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user, session_id=session_id)
        else:
            # For anonymous users, create a session without a user
            serializer.save(session_id=session_id)
    
    def destroy(self, request, *args, **kwargs):
        """
        Override destroy method to ensure users can only delete their own sessions
        """
        instance = self.get_object()
        
        # Check if the session belongs to the current user
        if request.user.is_authenticated and instance.user == request.user:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        elif not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication required to delete chat sessions."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        else:
            return Response(
                {"detail": "You do not have permission to delete this chat session."},
                status=status.HTTP_403_FORBIDDEN
            )
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        """
        Retrieves chat history for authenticated users
        Returns all chat sessions with their messages for the authenticated user
        """
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication required to access chat history."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Get user's chat sessions ordered by most recently updated
        chat_sessions = self.get_queryset()
        
        # Serialize the sessions including their messages
        serializer = ChatSessionSerializer(chat_sessions, many=True)
        
        return Response(serializer.data)
        
    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """
        Send a message in the chat session and get a response from the chatbot
        """
        session = self.get_object()
        
        # Save user message
        user_message_data = {
            'session': session.id,
            'role': 'user',
            'content': request.data.get('message', '')
        }
        
        user_message_serializer = ChatMessageCreateSerializer(data=user_message_data)
        if user_message_serializer.is_valid():
            user_message_serializer.save()
            
            # Process user message and generate response
            response_content = self.process_message(user_message_data['content'])
            
            # Save assistant response
            assistant_message_data = {
                'session': session.id,
                'role': 'assistant',
                'content': response_content
            }
            
            assistant_message_serializer = ChatMessageCreateSerializer(data=assistant_message_data)
            if assistant_message_serializer.is_valid():
                assistant_message_serializer.save()
                
                # Update the session's updated_at timestamp
                session.save()
                
                # Return the updated messages
                messages = ChatMessage.objects.filter(session=session)
                return Response(ChatMessageSerializer(messages, many=True).data)
            return Response(assistant_message_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(user_message_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def process_message(self, message):
        """
        Process user message and return a response
        This is a simple implementation for demo purposes
        In a real application, this would integrate with a more sophisticated NLP model
        """
        message = message.lower()
        
        # Dictionary mapping common product categories and terms to their database equivalents
        product_categories = {
            'mobile': 'Electronics',
            'phone': 'Electronics',
            'smartphone': 'Electronics',
            'laptop': 'Electronics',
            'computer': 'Electronics',
            'camera': 'Electronics',
            'headphone': 'Electronics',
            'speaker': 'Electronics',
            'watch': 'Electronics',
            'smartwatch': 'Electronics',
            'clothing': 'Clothing',
            'shirt': 'Clothing',
            'pants': 'Clothing',
            'dress': 'Clothing',
            'shoes': 'Clothing',
            'kitchen': 'Home & Kitchen',
            'home': 'Home & Kitchen',
            'furniture': 'Home & Kitchen',
            'book': 'Books',
            'sport': 'Sports & Outdoors',
            'fitness': 'Sports & Outdoors',
            'beauty': 'Beauty & Personal Care',
            'cosmetic': 'Beauty & Personal Care',
            'toy': 'Toys & Games',
            'game': 'Toys & Games',
            'health': 'Health & Wellness',
            'wellness': 'Health & Wellness'
        }
        
        # Check for direct product category requests (e.g., "show me phones" or "I want to see laptops")
        for keyword, category_name in product_categories.items():
            if keyword in message:
                try:
                    # Get the category
                    category = Category.objects.get(name=category_name)
                    
                    # Get specific products that match the keyword
                    products = Product.objects.filter(
                        Q(category=category) & 
                        (Q(name__icontains=keyword) | Q(description__icontains=keyword))
                    )
                    
                    # If no specific products found, get all from that category
                    if not products:
                        products = Product.objects.filter(category=category)[:5]
                    
                    if products:
                        product_list = "\n".join([f"- {product.name}: ${product.price} ({product.stock} in stock)" for product in products[:5]])
                        return f"Here are some {keyword} products I found for you:\n{product_list}\n\nWould you like more details on any of these?"
                    
                except Category.DoesNotExist:
                    pass  # Continue to next check if category doesn't exist
        
        # Check for product search intent
        if any(keyword in message for keyword in ['search', 'find', 'looking for', 'show', 'display', 'get', 'want']):
            # Extract potential product keywords
            product_keywords = [word for word in message.split() 
                               if word not in ['search', 'find', 'looking', 'for', 'show', 'me', 'a', 'the', 'and', 'or', 'in', 'display', 'get', 'want', 'to', 'see']]
            
            if product_keywords:
                # Search for products matching keywords
                products = []
                for keyword in product_keywords:
                    if len(keyword) > 2:  # Ignore very short words
                        query_results = Product.objects.filter(
                            Q(name__icontains=keyword) | Q(description__icontains=keyword)
                        )[:3]  # Limit to 3 results per keyword
                        products.extend(list(query_results))
                
                if products:
                    product_list = "\n".join([f"- {product.name}: ${product.price} ({product.stock} in stock)" for product in products[:5]])
                    return f"I found these products that might interest you:\n{product_list}\n\nWould you like more details on any of these?"
                else:
                    return "I couldn't find any products matching your search. Could you try different keywords or browse our categories?"
        
        # Check for greeting intent
        elif any(greeting in message for greeting in ['hello', 'hi', 'hey', 'greetings']):
            return "Hello! I'm your shopping assistant. How can I help you today? You can ask me to search for products, show categories, or help with your order."
        
        # Check for help intent
        elif any(help_word in message for help_word in ['help', 'assist', 'support']):
            return "I can help you with:\n- Searching for products\n- Exploring categories\n- Getting product recommendations\n- Checking product availability\n- Simulating purchases\n\nWhat would you like to do?"
        
        # Check for category browsing intent
        elif any(category_word in message for category_word in ['category', 'categories', 'browse']):
            categories = Category.objects.all()
            category_list = "\n".join([f"- {category.name}" for category in categories])
            return f"Here are our product categories:\n{category_list}\n\nWhich category would you like to explore?"
        
        # Default response
        else:
            return "I'm here to help you find products! You can ask me to show you specific items like 'show me phones', browse categories, or search for products by name."

class ChatMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.AllowAny]  # Allow any user to access chat messages
    
    def get_queryset(self):
        session_id = self.request.query_params.get('session_id')
        if session_id:
            return ChatMessage.objects.filter(session__session_id=session_id)
        
        # If user is authenticated, return their messages
        user = self.request.user
        if user.is_authenticated:
            return ChatMessage.objects.filter(session__user=user)
            
        return ChatMessage.objects.none()
