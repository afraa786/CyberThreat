from rest_framework import serializers
from .models import (
    Community, Post, File, Vote, Comment, Reply,
    CommentVote, CommentReplyVote, SavePost, CommunityUsers
)
from authentication.serializers import UserSerializer



class FileSerializer(serializers.ModelSerializer):
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = File
        fields = ['id', 'file', 'post', 'uploaded_at']
        read_only_fields = ['uploaded_at']


class VoteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Vote
        fields = ['id', 'post', 'user', 'value', 'created_at']
        read_only_fields = ['user', 'created_at']



class CommentVoteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = CommentVote
        fields = ['id', 'comment', 'user', 'value', 'created_at']
        read_only_fields = ['user', 'created_at']


class CommentReplyVoteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = CommentReplyVote
        fields = ['id', 'reply', 'user', 'value', 'created_at']
        read_only_fields = ['user', 'created_at']

class ReplySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    reply_votes_like_count = serializers.SerializerMethodField()
    reply_votes_dislike_count = serializers.SerializerMethodField()
    class Meta:
        model = Reply
        fields = ['id', 'comment', 'user', 'content', 'created_at',
                  'reply_votes_like_count', 'reply_votes_dislike_count']
        read_only_fields = ['user', 'created_at',
                            'reply_votes_like_count', 'reply_votes_dislike_count']
    def get_reply_votes_like_count(self, obj):
        return obj.reply_votes.filter(value=1).count()
    def get_reply_votes_dislike_count(self, obj):
        return obj.reply_votes.filter(value=-1).count()


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = ReplySerializer(many=True, read_only=True)
    comment_votes_like_count = serializers.SerializerMethodField()
    comment_votes_dislike_count = serializers.SerializerMethodField()
    total_number_of_replies = serializers.SerializerMethodField()
    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'content', 'created_at', 'replies',
                  'comment_votes_like_count', 'comment_votes_dislike_count', 'total_number_of_replies']
        read_only_fields = ['user', 'created_at', 'replies',
                            'comment_votes_like_count', 'comment_votes_dislike_count', 'total_number_of_replies']
    def get_comment_votes_like_count(self, obj):
        return obj.comment_votes.filter(value=1).count()
    def get_comment_votes_dislike_count(self, obj):
        return obj.comment_votes.filter(value=-1).count()
    def get_total_number_of_replies(self, obj):
        return obj.replies.count()
    

class SavePostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = SavePost
        fields = ['id', 'post', 'user', 'created_at']
        read_only_fields = ['user', 'created_at']

class CommunityUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = CommunityUsers
        fields = ['id', 'community', 'user', 'role', 'created_at']
        read_only_fields = ['user', 'created_at']


class PostSerializer(serializers.ModelSerializer):
    votes_like_count = serializers.SerializerMethodField()
    votes_dislike_count = serializers.SerializerMethodField()
    saved_count = serializers.SerializerMethodField()
    community_name = serializers.CharField(source='community.name', read_only=True)
    files = FileSerializer(many=True, read_only=True)

    # Personalized fields for current user
    user_vote = serializers.SerializerMethodField()
    user_saved = serializers.SerializerMethodField()
    user_comments = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id", "title", "content", "created_at", "updated_at",
            "votes_like_count", "votes_dislike_count", "saved_count",
            "community_name", "files",
            "user_vote", "user_saved", "user_comments"
        ]
        read_only_fields = [
            'created_at', 'updated_at', 'votes_like_count', 'votes_dislike_count',
            'saved_count', 'community_name', 'files', 'user_vote', 'user_saved', 'user_comments'
        ]

    # Global counts
    def get_votes_like_count(self, obj):
        return obj.post_votes.filter(value=1).count()

    def get_votes_dislike_count(self, obj):
        return obj.post_votes.filter(value=-1).count()

    def get_saved_count(self, obj):
        return obj.saves.count()

    # Current user personalized data
    def get_user_vote(self, obj):
        user = self.context.get('user')
        if not user:
            return None
        vote = obj.post_votes.filter(user=user).first()
        return vote.value if vote else None

    def get_user_saved(self, obj):
        user = self.context.get('user')
        if not user:
            return False
        return obj.saves.filter(user=user).exists()

    def get_user_comments(self, obj):
        user = self.context.get('user')
        if not user:
            return []
        comments = obj.comments.filter(user=user)
        return CommentSerializer(comments, many=True, context={'user': user}).data


class CommunitySerializer(serializers.ModelSerializer):
    total_members_count = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()  # new field

    class Meta:
        model = Community
        fields = [
            "id", "name", "description", "created_at",
            "total_members_count", "user_role"
        ]

    def get_total_members_count(self, obj):
        return obj.roles.count()

    def get_user_role(self, obj):
        user = self.context.get('user', None)  # yaha user le lo
        if not user:
            return None

        community_user = obj.roles.filter(user=user).first()
        if community_user:
            return community_user.role  # 'member', 'admin', 'super_admin'
        return None
