from django.forms import ModelForm
from .models import ContactMessage
from django import forms
from .models import BlogPost, BlogPostImage

class ContactForm(ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'message']

class BlogPostForm(forms.ModelForm):
    class Meta:
        model = BlogPost
        fields = ['title', 'content']
    
    def save(self, commit=True):
        blog_post = super().save(commit=False)
        if commit:
            blog_post.save()
        return blog_post