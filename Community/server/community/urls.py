# community/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PostAPIView,
    CommunityAPIView,
    FileViewSet,
    VoteViewSet,
    CommentViewSet,
    ReplyViewSet,
    CommentVoteViewSet,
    CommentReplyVoteViewSet,
    SavePostViewSet,
    CommunityUsersViewSet,
    RoleManagementAPIView,
    UserActivityAPIView
)

router = DefaultRouter()
router.register(r'files', FileViewSet, basename='file')
router.register(r'votes', VoteViewSet, basename='vote')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'replies', ReplyViewSet, basename='reply')
router.register(r'comment-votes', CommentVoteViewSet, basename='commentvote')
router.register(r'comment-reply-votes', CommentReplyVoteViewSet, basename='commentreplyvote')
router.register(r'saved-posts', SavePostViewSet, basename='savepost')
router.register(r'community-users', CommunityUsersViewSet, basename='communityuser')

urlpatterns = [
    # Community
    path('communities/', CommunityAPIView.as_view(), name='community-list'),
    path('communities/<int:pk>/', CommunityAPIView.as_view(), name='community-detail'),

    # Post
    path('posts/', PostAPIView.as_view(), name='post-list'),
    path('posts/<int:pk>/', PostAPIView.as_view(), name='post-detail'),

    # Role Management
    path('communities/<int:community_id>/roles/', RoleManagementAPIView.as_view(), name='role-management'),
    # User Activity
    path('users/activity/', UserActivityAPIView.as_view(), name='user-activity'),

    # DRF Routers
    path('', include(router.urls)),
]
