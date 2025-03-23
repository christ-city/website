from django.contrib import admin
from .models import ContactMessage
from .models import BlogPost, Comment
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import AboutContent
from .models import Donation, BlogPostImage
from django.contrib import admin
from django.contrib.admin import TabularInline


# Custom BlogPost Admin
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "created_at")
    search_fields = ("title", "author__username")
    list_filter = ("created_at",)
    actions = ["delete_selected"]

    def has_change_permission(self, request, obj=None):
        # Admin can edit any post
        return True

    def has_delete_permission(self, request, obj=None):
        # Admin can delete any post
        return True

class BlogPostImageInline(admin.TabularInline):
    model = BlogPostImage
    extra = 1

class BlogPostAdmin(admin.ModelAdmin):
    inlines = [BlogPostImageInline]





# Custom Comment Admin
class CommentAdmin(admin.ModelAdmin):
    list_display = ("post", "user", "created_at")
    search_fields = ("user__username", "content")
    list_filter = ("created_at",)
    actions = ["delete_selected"]

    def has_delete_permission(self, request, obj=None):
        # Admin can delete any comment
        return True

# Custom User Admin
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "is_staff", "is_superuser", "date_joined")
    search_fields = ("username", "email")
    actions = ["delete_selected"]

    def has_delete_permission(self, request, obj=None):
        # Admin can delete any user
        return True

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "message", "submitted_at")  
    search_fields = ("name", "email", "message")
    readonly_fields = ("submitted_at",) 




class DonationAdmin(admin.ModelAdmin):
    list_display = ("user", "email", "donation_type", "amount", "status", "created_at")
    list_filter = ("donation_type", "status", "created_at")
    search_fields = ("user__username", "email", "amount")
    readonly_fields = ("created_at",)



# Register the models
admin.site.register(BlogPost, BlogPostAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(AboutContent)
admin.site.unregister(User)  # Unregister the default User model
admin.site.register(User, CustomUserAdmin)  # Register with custom settings
admin.site.register(Donation, DonationAdmin)



