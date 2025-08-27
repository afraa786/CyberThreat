from django.db import models
from authentication.models import User

# Create your models here.

# this is the main community of social media app
class Community(models.Model):
    name = models.CharField(max_length=100, unique=True, null=False)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    profile_picture = models.ImageField(upload_to='community_profiles/', null=True, blank=True)

    def __str__(self):
        return self.name
    
# posts in the community
class Post(models.Model):
    community = models.ForeignKey(Community, related_name='posts', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='posts', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.user.email} in {self.community.name}"
    
# files attached to the post
class File(models.Model):
    post = models.ForeignKey(Post, related_name='files', on_delete=models.CASCADE)
    file = models.FileField(upload_to='post_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"File for post: {self.post.title}"
    
# votes on the post
class Vote(models.Model):
    VOTE_TYPES = (
        (1, 'Upvote'),
        (-1, 'Downvote'),
    )
    post = models.ForeignKey(Post, related_name='post_votes', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='user_votes', on_delete=models.CASCADE)
    value = models.SmallIntegerField(choices=VOTE_TYPES)  # 1 = Upvote, -1 = Downvote
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')  # ek user ek post pe sirf ek vote de sakta hai

    def __str__(self):
        action = "Upvoted" if self.value == 1 else "Downvoted"
        return f"{self.user.email} {action} {self.post.title}"

# comments on the post
class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='user_comments', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    tag = models.ForeignKey(User, related_name='tagged_comments', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Comment by {self.user.email} on {self.post.title}"
    
# replies to comments
class Reply(models.Model):
    comment = models.ForeignKey(Comment, related_name='replies', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='user_replies', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    tag = models.ForeignKey(User, related_name='tagged_replies', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Reply by {self.user.email} on comment {self.comment.id}"


# votes on comments
class CommentVote(models.Model):
    VOTE_TYPES = (
        (1, 'Upvote'),
        (-1, 'Downvote'),
    )
    comment = models.ForeignKey(Comment, related_name='comment_votes', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='user_comment_votes', on_delete=models.CASCADE)
    value = models.SmallIntegerField(choices=VOTE_TYPES)  # 1 = Upvote, -1 = Downvote
    created_at = models.DateTimeField(auto_now_add=True)    
    class Meta:
        unique_together = ('comment', 'user')
    def __str__(self):
        action = "Upvoted" if self.value == 1 else "Downvoted"
        return f"{self.user.email} {action} comment {self.comment.id}"
    

# votes on replies
class CommentReplyVote(models.Model):
    VOTE_TYPES = (
        (1, 'Upvote'),
        (-1, 'Downvote'),
    )
    reply = models.ForeignKey(Reply, related_name='reply_votes', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='user_reply_votes', on_delete=models.CASCADE)
    value = models.SmallIntegerField(choices=VOTE_TYPES)  # 1 = Upvote, -1 = Downvote
    created_at = models.DateTimeField(auto_now_add=True)    
    class Meta:
        unique_together = ('reply', 'user')
    def __str__(self):
        action = "Upvoted" if self.value == 1 else "Downvoted"
        return f"{self.user.email} {action} reply {self.reply.id}"
    

# saved posts by users
class SavePost(models.Model):
    post = models.ForeignKey(Post, related_name='saves', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='saved_posts', on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')

    def __str__(self):
        return f"{self.user.email} saved {self.post.title}"
    
# community roles
class CommunityUsers(models.Model):
    ROLE_CHOICES = (
        ('member', 'Member'),
        ('admin', 'Admin'),
        ('super_admin', 'Super Admin'),
    )
    community = models.ForeignKey(Community, related_name='roles', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='community_roles', on_delete=models.CASCADE)
    role = models.CharField(max_length=15, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('community', 'user')

    def __str__(self):
        return f"{self.user.email} is a {self.role} in {self.community.name}"