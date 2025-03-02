from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


from django.utils.text import slugify

class BlogPost(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    content = models.TextField()
    image = models.ImageField(upload_to='blog_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(User, related_name="blog_likes", blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            # Generate a unique slug
            base_slug = slugify(self.title)
            unique_slug = base_slug
            num = 1
            while BlogPost.objects.filter(slug=unique_slug).exists():
                unique_slug = f"{base_slug}-{num}"
                num += 1
            self.slug = unique_slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    def total_likes(self):
        return self.likes.count()

class BlogPostImage(models.Model):
    blog_post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="blog_images/")


# Comment Model
class Comment(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE, related_name="nested_replies")  # For replies
    likes = models.ManyToManyField(User, blank=True, related_name="liked_comments")  # Users who liked

    def total_likes(self):
        return self.likes.count()

    def __str__(self):
        return f"{self.user.username}: {self.content[:30]}"

class Reply(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='replies')
    commenter = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class AboutContent(models.Model):
    mission = models.TextField()
    story = models.TextField()
    impact = models.TextField()
    founded_year = models.IntegerField()
    people_helped = models.IntegerField()
    active_projects = models.IntegerField()

    class Meta:
        verbose_name_plural = "About Page Content"

    def __str__(self):
        return "About Page Content"

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name} - {self.email}"
    


class Donation(models.Model):
    DONATION_TYPE = [
        ('monthly', 'Monthly'),
        ('one-time', 'One-Time'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    donation_type = models.CharField(max_length=10, choices=DONATION_TYPE)
    created_at = models.DateTimeField(auto_now_add=True)
    email = models.EmailField()

    def __str__(self):
        return f"{self.user.username if self.user else 'Guest'} - {self.donation_type} - ${self.amount}"
