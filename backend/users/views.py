from rest_framework.views import APIView
from rest_framework import generics 
from rest_framework.generics import ListAPIView, DestroyAPIView, UpdateAPIView, CreateAPIView
from .permissions import IsAdminUser
from .serializers import RegisterSerializer, UserSerializer, AdminUserCreateSerializer, AdminUserUpdateSerializer
from .models import User
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter
from rest_framework.parsers import MultiPartParser, FormParser

class RegisterView(generics.CreateAPIView):
  serializer_class = RegisterSerializer
  permission_classes = [AllowAny]


class ProfileView(APIView):
  permission_classes = [IsAuthenticated]
  parser_classes = [MultiPartParser, FormParser] 

  def get(self, request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

  def patch(self, request):
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    
    return Response(serializer.errors)
  

class AdminUserListView(ListAPIView):
   queryset = User.objects.all()
   serializer_class = UserSerializer
   permission_classes = [IsAdminUser]
   filter_backends = [SearchFilter]
   search_fields = ['username', 'email']

class AdminCreateUser(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserCreateSerializer
    permission_classes = [IsAdminUser]

class AdminUpdateUser(UpdateAPIView):
   queryset = User.objects.all()
   serializer_class = AdminUserUpdateSerializer
   permission_classes = [IsAdminUser]

class AdminDeleteUser(DestroyAPIView):
   queryset = User.objects.all()
   serializer_class = UserSerializer
   permission_classes = [IsAdminUser]