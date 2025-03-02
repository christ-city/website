from django.contrib import admin
from django.urls import path, include
from . import views
from django.contrib.auth.views import LogoutView
from .views import contact_view, login_view, register_view, logout_view
from .views import donate_page, process_donation, create_blog_post, flutterwave_webhook
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', views.index, name="index"),
    path('about/', views.about, name='about'),  # About page
    path('logout/', LogoutView.as_view(), name="logout"),
    path('school/', views.school, name="school" ),
    path('donate/', views.donate, name="donate"),
    path("contact/", contact_view, name="contact"),
    path('register/', register_view, name="register"),
    path('login/', login_view, name="login"),
    path('logout', logout_view, name="logout"),
    path('accounts/', include('allauth.urls')),
    path("donate/", donate_page, name="donate"),
    path("donate/process/", process_donation, name="process_donation"),
    path("flutterwave-webhook/", flutterwave_webhook, name="flutterwave_webhook"),
    path("donate2/", views.donate2, name="donate2"),
    path("donate/<str:donation_type>/", views.redirect_donation, name="redirect_donation"),
    path('donate_one_time/', views.donate_one_time, name="donate_one_time"), 
    path('donate_monthly/', views.donate_monthly, name="donate_monthly"),  
    path('blog/', views.blog_list, name='blog_list'),
    path('blog/<slug:slug>/', views.blog_detail, name='blog_detail'),
    path('blog/create/', views.create_blog_post, name='create_blog_post'),
    path('blog/delete/<slug:slug>/', views.delete_blog_post, name='delete_blog_post'),
    path('search/', views.blog_search, name='blog_search'),
    path('create/', views.create_blog_post, name='create_blog_post'),
    path("comment/<int:comment_id>/like/", views.like_comment, name="like_comment"),
    path("comment/<int:comment_id>/reply/", views.reply_comment, name="reply_comment"),
    path("blog/<int:post_id>/like/", views.like_post, name="like_post"),
    path("blog/<int:post_id>/comment/", views.add_comment, name="add_comment"),
    
   ]