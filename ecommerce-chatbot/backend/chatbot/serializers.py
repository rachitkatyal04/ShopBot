from rest_framework import serializers
from .models import ChatSession, ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'role', 'content', 'timestamp']
        read_only_fields = ['timestamp']

class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True, required=False, allow_null=True)
    
    class Meta:
        model = ChatSession
        fields = ['id', 'session_id', 'user', 'created_at', 'updated_at', 'messages']
        read_only_fields = ['session_id', 'created_at', 'updated_at']
        
class ChatMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['role', 'content', 'session'] 