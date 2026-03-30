from rest_framework.views import APIView
from rest_framework import generics 
from rest_framework.generics import ListAPIView, DestroyAPIView, UpdateAPIView, CreateAPIView
from .permissions import IsAdminUser
from .serializers import RegisterSerializer, UserSerializer, AdminUserCreateSerializer, AdminUserUpdateSerializer, ProfileUpdateSerializer
from .models import User
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination

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
    serializer = ProfileUpdateSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserPagination(PageNumberPagination):
    page_size = 5

class AdminUserListView(ListAPIView):
   queryset = User.objects.all().order_by('-id')
   serializer_class = UserSerializer
   permission_classes = [IsAdminUser]
   filter_backends = [SearchFilter]
   search_fields = ['username', 'email']
   pagination_class = UserPagination

class AdminGetUser(generics.RetrieveAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer
  permission_classes = [IsAdminUser]

class AdminCreateUser(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserCreateSerializer
    permission_classes = [IsAdminUser]
    
    def get_serializer_context(self):
        return {'request': self.request}

class AdminUpdateUser(UpdateAPIView):
   queryset = User.objects.all()
   serializer_class = AdminUserUpdateSerializer
   permission_classes = [IsAdminUser]
   
class AdminDeleteUser(DestroyAPIView):
   queryset = User.objects.all()
   serializer_class = UserSerializer
   permission_classes = [IsAdminUser]

   def destroy(self, request, *args, **kwargs):
        target = self.get_object()

        if target == request.user:
            return Response({"error": "You cannot delete your own account."}, status=400)

        if target.is_superuser:
            return Response({"error": "Superadmin cannot be deleted."}, status=403)

        if request.user.is_admin and target.is_admin:
            return Response({"error": "Admins cannot delete other admins."}, status=403)

        return super().destroy(request, *args, **kwargs)
     