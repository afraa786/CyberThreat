import os
import jwt
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from authentication.models import User
from utils.usercheck import authenticate_request
from .models import (
    Community, Post, File, Vote, Comment, Reply,
    CommentVote, CommentReplyVote, SavePost, CommunityUsers
)
from .serializer import (
    CommunitySerializer, PostSerializer, FileSerializer, VoteSerializer,
    CommentSerializer, ReplySerializer, CommentVoteSerializer,
    CommentReplyVoteSerializer, SavePostSerializer, CommunityUserSerializer,
    UserSerializer
)




# ------------------------
# Post API
# ------------------------
class PostAPIView(APIView):
    def get(self, request):
        user = authenticate_request(request, need_user=True)
        posts = Post.objects.all().order_by('-created_at')
        serializer = PostSerializer(posts, many=True, context={'user': user})
        return Response(serializer.data)
    
    def post(self, request):
        user = authenticate_request(request, need_user=True)
        community_id = request.data.get('community')
        if not community_id:
            return Response({"error": "Community ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user is member of community
        membership = CommunityUsers.objects.filter(community_id=community_id, user=user).first()
        if not membership:
            return Response({"error": "You are not a member of this community"}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            post = serializer.save(user=user, community_id=community_id)

            # Handle multiple files
            files = request.FILES.getlist('files')
            for f in files:
                File.objects.create(post=post, file=f)

            post_data = PostSerializer(post, context={'user': user}).data
            return Response(post_data, status=status.HTTP_201_CREATED)
        


    def put(self, request, pk):
        user = authenticate_request(request, need_user=True)
        post = Post.objects.filter(pk=pk, user=user).first()
        if not post:
            return Response({"error": "Unauthorized: only author can update this post"},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = authenticate_request(request, need_user=True)
        post = Post.objects.filter(pk=pk).first()
        if not post:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        # Author can delete
        if post.user == user:
            post.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        # Admin or Super Admin of community can delete
        role = CommunityUsers.objects.filter(
            community=post.community, user=user, role__in=['admin', 'super_admin']
        ).first()
        if role:
            post.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response({"error": "Unauthorized: only author, admin or super_admin can delete"},
                        status=status.HTTP_403_FORBIDDEN)



# ------------------------
# Community API
# ------------------------

class CommunityAPIView(APIView):
    def get(self, request):
        user = authenticate_request(request, need_user=True)
        communities = Community.objects.all()
        serializer = CommunitySerializer(
            communities, 
            many=True, 
            context={'request': request, 'user': user}  # user explicitly pass karo
        )
        return Response(serializer.data)

    def post(self, request):
        user = authenticate_request(request, need_user=True)
        serializer = CommunitySerializer(data=request.data)
        if serializer.is_valid():
            community = serializer.save()

            # Add creator as super_admin in CommunityUsers
            CommunityUsers.objects.create(
                community=community,
                user=user,
                role='super_admin'
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        user = authenticate_request(request, need_user=True)

        # Check if user has admin or super_admin role in this community
        role = CommunityUsers.objects.filter(
            community_id=pk, user=user, role__in=['admin', 'super_admin']
        ).first()
        if not role:
            return Response({"error": "Unauthorized, only admin or super_admin can update"},
                            status=status.HTTP_403_FORBIDDEN)

        community = Community.objects.filter(pk=pk).first()
        if not community:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CommunitySerializer(community, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()  # no need to override created_by here
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = authenticate_request(request, need_user=True)

        # Check if user is super_admin
        role = CommunityUsers.objects.filter(
            community_id=pk, user=user, role='super_admin'
        ).first()
        if not role:
            return Response({"error": "Unauthorized, only super_admin can delete"},
                            status=status.HTTP_403_FORBIDDEN)

        community = Community.objects.filter(pk=pk).first()
        if not community:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        community.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ------------------------
# File API (No update/delete)
# ------------------------
class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer

    def list(self, request, *args, **kwargs):
        authenticate_request(request)
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        user = authenticate_request(request, need_user=True)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return Response({"error": "Update not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def destroy(self, request, *args, **kwargs):
        return Response({"error": "Delete not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


# ------------------------
# Vote API
# ------------------------
class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer

    def list(self, request, *args, **kwargs):
        authenticate_request(request)
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        user = authenticate_request(request, need_user=True)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        user = authenticate_request(request, need_user=True)
        vote = self.get_object()
        if vote.user != user:
            return Response({"error": "Unauthorized"}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user = authenticate_request(request, need_user=True)
        vote = self.get_object()
        if vote.user != user:
            return Response({"error": "Unauthorized"}, status=403)
        return super().destroy(request, *args, **kwargs)



# ------------------------
# Comment API
# ------------------------
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer

    def list(self, request, *args, **kwargs):
        authenticate_request(request)
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        user = authenticate_request(request, need_user=True)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    def destroy(self, request, *args, **kwargs):
        user = authenticate_request(request, need_user=True)
        comment = self.get_object()

        # Comment author ya post author delete kar sakta hai
        if comment.user == user or comment.post.user == user:
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            {"error": "Unauthorized: only comment author or post author can delete"},
            status=status.HTTP_403_FORBIDDEN
        )

# ------------------------
# Reply API
# ------------------------
class ReplyViewSet(viewsets.ModelViewSet):
    queryset = Reply.objects.all().order_by('-created_at')
    serializer_class = ReplySerializer

    def list(self, request, *args, **kwargs):
        authenticate_request(request)
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        user = authenticate_request(request, need_user=True)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    def destroy(self, request, *args, **kwargs):
        user = authenticate_request(request, need_user=True)
        reply = self.get_object()

        # Reply author ya post author delete kar sakta hai
        if reply.user == user or reply.comment.post.user == user:
            reply.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(
            {"error": "Unauthorized: only reply author or post author can delete"},
            status=status.HTTP_403_FORBIDDEN
        )


# ------------------------
# Comment Vote API
# ------------------------

class CommentVoteViewSet(viewsets.ModelViewSet):
    queryset = CommentVote.objects.all()
    serializer_class = CommentVoteSerializer

    def list(self, request, *args, **kwargs):
        authenticate_request(request)
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        user = authenticate_request(request, need_user=True)
        comment_id = request.data.get('comment')
        value = request.data.get('value')

        if not comment_id or value is None:
            return Response({"error": "Comment ID and value required"}, status=400)

        # Check if vote already exists
        vote = CommentVote.objects.filter(user=user, comment_id=comment_id).first()
        if vote:
            vote.value = value
            vote.save()
            serializer = self.get_serializer(vote)
            return Response(serializer.data)

        # Create new vote
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        user = authenticate_request(request, need_user=True)
        vote = self.get_object()
        if vote.user != user:
            return Response({"error": "Unauthorized"}, status=403)
        vote.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ------------------------
# Comment Reply Vote API
# ------------------------
class CommentReplyVoteViewSet(viewsets.ModelViewSet):
    queryset = CommentReplyVote.objects.all()
    serializer_class = CommentReplyVoteSerializer

    def list(self, request, *args, **kwargs):
        authenticate_request(request)
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        user = authenticate_request(request, need_user=True)
        reply_id = request.data.get('reply')
        value = request.data.get('value')

        if not reply_id or value is None:
            return Response({"error": "Reply ID and value required"}, status=400)

        # Check if vote already exists
        vote = CommentReplyVote.objects.filter(user=user, reply_id=reply_id).first()
        if vote:
            vote.value = value
            vote.save()
            serializer = self.get_serializer(vote)
            return Response(serializer.data)

        # Create new vote
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        user = authenticate_request(request, need_user=True)
        vote = self.get_object()
        if vote.user != user:
            return Response({"error": "Unauthorized"}, status=403)
        vote.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



# ------------------------
# Save Post API
# ------------------------
class SavePostViewSet(viewsets.ModelViewSet):
    queryset = SavePost.objects.all()
    serializer_class = SavePostSerializer

    def list(self, request, *args, **kwargs):
        authenticate_request(request)
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        user = authenticate_request(request, need_user=True)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, *args, **kwargs):
        user = authenticate_request(request, need_user=True)
        save_post = self.get_object()
        if save_post.user != user:
            return Response({"error": "Unauthorized"}, status=403)
        save_post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ------------------------
# Community Users API
# ------------------------
class CommunityUsersViewSet(viewsets.ModelViewSet):
    queryset = CommunityUsers.objects.all()
    serializer_class = CommunityUserSerializer

    def list(self, request, *args, **kwargs):
        authenticate_request(request)
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        user = authenticate_request(request, need_user=True)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, *args, **kwargs):
        user = authenticate_request(request, need_user=True)
        community_user = self.get_object()
        if community_user.user != user:
            return Response({"error": "Unauthorized"}, status=403)
        community_user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class RoleManagementAPIView(APIView):
    def post(self, request, community_id):
        user = authenticate_request(request, need_user=True)
        target_user_id = request.data.get('user_id')
        new_role = request.data.get('role')

        if new_role not in ['member', 'admin', 'super_admin']:
            return Response({"error": "Invalid role"}, status=400)

        # Fetch community
        community = Community.objects.filter(id=community_id).first()
        if not community:
            return Response({"error": "Community not found"}, status=404)

        # Fetch requester role
        requester_role_obj = CommunityUsers.objects.filter(
            community=community, user=user
        ).first()
        if not requester_role_obj:
            return Response({"error": "You are not part of this community"},
                            status=403)

        requester_role = requester_role_obj.role

        # Fetch target user
        target_user = User.objects.filter(id=target_user_id).first()
        if not target_user:
            return Response({"error": "Target user not found"}, status=404)

        # Fetch target user's current role
        target_role_obj = CommunityUsers.objects.filter(
            community=community, user=target_user
        ).first()
        target_role = target_role_obj.role if target_role_obj else None

        # Role change rules
        if requester_role == 'super_admin':
            # super_admin can do anything
            pass
        elif requester_role == 'admin':
            # admin cannot touch super_admins
            if target_role == 'super_admin':
                return Response({"error": "Unauthorized: cannot change super_admin role"},
                                status=403)
            # admin can assign only member or admin
            if new_role == 'super_admin':
                return Response({"error": "Unauthorized: admin cannot make super_admin"},
                                status=403)
        else:
            return Response({"error": "Unauthorized: only admin or super_admin can assign roles"},
                            status=403)

        # Update or create role
        community_user, created = CommunityUsers.objects.update_or_create(
            community=community,
            user=target_user,
            defaults={'role': new_role}
        )

        serializer = CommunityUserSerializer(community_user)
        return Response(serializer.data, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)


class UserActivityAPIView(APIView):
    def get(self, request):
        user = authenticate_request(request, need_user=True)

        # User ke communities
        communities_qs = CommunityUsers.objects.filter(user=user)
        communities_data = []

        for cu in communities_qs:
            community = cu.community

            # 1️⃣ User ke posts in this community
            user_posts = Post.objects.filter(user=user, community=community)

            # 2️⃣ Posts liked by user in this community
            liked_posts = Post.objects.filter(
                community=community,
                post_votes__user=user,
                post_votes__value=1
            )

            # 3️⃣ Posts disliked by user
            disliked_posts = Post.objects.filter(
                community=community,
                post_votes__user=user,
                post_votes__value=-1
            )

            # 4️⃣ Posts saved by user
            saved_posts = SavePost.objects.filter(
                user=user,
                post__community=community
            ).select_related('post')

            # Serialize posts with context user (to show if this user has voted/saved etc.)
            def serialize_posts(posts):
                return PostSerializer(posts, many=True, context={'user': user}).data

            # Serialize saved posts objects
            saved_posts_list = [s.post for s in saved_posts]

            communities_data.append({
                "community_id": community.id,
                "community_name": community.name,
                "role": cu.role,
                "user_posts_count": user_posts.count(),
                "liked_posts_count": liked_posts.count(),
                "disliked_posts_count": disliked_posts.count(),
                "saved_posts_count": saved_posts.count(),
                "user_posts": serialize_posts(user_posts),
                "liked_posts": serialize_posts(liked_posts),
                "disliked_posts": serialize_posts(disliked_posts),
                "saved_posts": serialize_posts(saved_posts_list),
            })

        return Response({
            "user_id": user.id,
            "email": user.email,
            "communities": communities_data
        }, status=status.HTTP_200_OK)
