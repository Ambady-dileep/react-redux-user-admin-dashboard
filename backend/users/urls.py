from django.urls import path
from .views import (
    AdminUserListView,
    AdminUserStatsView,
    AdminCreateUser,
    AdminUpdateUser,
    AdminDeleteUser,
    RegisterView, 
    ProfileView,
    AdminGetUser,
)

urlpatterns = [
    path('me/', ProfileView.as_view()),
    path('register/', RegisterView.as_view(), name='register'),
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/stats/', AdminUserStatsView.as_view(), name='admin-stats'),
    path('admin/users/create/', AdminCreateUser.as_view(), name='admin-create-user'),
    path('admin/users/<int:pk>/', AdminGetUser.as_view(), name='admin-get-user'), 
    path('admin/users/<int:pk>/update/', AdminUpdateUser.as_view(), name='admin-update-user'),
    path('admin/users/<int:pk>/delete/', AdminDeleteUser.as_view(), name='admin-delete-user'),
]
