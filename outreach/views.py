from django.shortcuts import render, redirect, get_object_or_404
from django.core.mail import send_mail
from django.contrib import messages
from django.conf import settings 
from .forms import ContactForm, BlogPostForm 
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.core.mail import send_mail
from .models import Donation, BlogPostImage
from django.contrib import messages
from .models import BlogPost, Comment
from .forms import BlogPostForm
from django.db.models import Q
from django.http import JsonResponse
import json
import requests
import hmac
import hashlib
from django.views.decorators.csrf import csrf_exempt



def index(request):
    
    return render(request, "outreach/index.html", {
        
    })
def about(request):
    return render(request, 'outreach/about.html')

def school(request):
    return render(request, "outreach/school.html")

def donate(request):
    return render(request, "outreach/donate.html")

def contact(request):
    return render(request, "outreach/contact.html" )

def contact_view(request):
    if request.method == "POST":
        form = ContactForm(request.POST)

        if form.is_valid():
            try:
                # Save the form
                contact_message = form.save()
                
                # Send email notification
                send_mail(
                    subject=f"New Contact Form Submission: {contact_message.subject}",
                    message=f"Name: {contact_message.name}\nEmail: {contact_message.email}\nMessage: {contact_message.message}",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[settings.EMAIL_HOST_USER],  # Or your desired recipient
                )
                
                messages.success(request, 'Your message has been sent successfully!')
                return redirect('success_page')
            except Exception as e:
                # Log the error and show a user-friendly message
                print(f"Error sending email: {e}")
                messages.error(request, 'There was an error sending your message. Please try again later.')
                
    else:
        form = ContactForm()

    return render(request, "outreach/contact.html", {"form": form})


# ✅ Register User
def register_view(request):
    if request.user.is_authenticated:
        return redirect("index")
    
    if request.method == "POST":
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        
        # Debugging the values you're getting (optional)
        print(f"Received: {username}, {email}, {password1}, {password2}")

        # Check if passwords match
        if password1 != password2:
            messages.error(request, "Passwords do not match.")
            return render(request, 'outreach/register.html')

        # Check if the username already exists
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username is already taken.")
            return render(request, 'outreach/register.html')

        # Check if the email already exists
        if User.objects.filter(email=email).exists():
            messages.error(request, "Email is already registered.")
            return render(request, 'outreach/register.html')

        # If everything looks good, create the user
        try:
            # Create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password1
            )
            
            # Authenticate and login
            user = authenticate(request, username=username, password=password1)  # Ensure user authentication
            if user is not None:
                login(request, user)
                messages.success(request, f"Welcome, {username}! Your account has been created successfully.")
                return redirect("index")
            else:
                messages.error(request, "Something went wrong during login.")
                return redirect("register")
                
        except Exception as e:
            messages.error(request, f"An error occurred: {e}")
            return render(request, 'outreach/register.html')
    
    return render(request, 'outreach/register.html')



# ✅ Login User
def login_view(request):
    if request.method == "POST":
        username = request.POST.get('username').strip()
        password = request.POST.get('password').strip()

        print(f"Trying to log in: {username}, {password}")  # Debugging

        # Authenticate the user
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # If authentication is successful, log the user in and redirect
            login(request, user)
            messages.success(request, f"Welcome back, {username}!")
            return redirect("index")  # Redirect to index page after login
        else:
            messages.error(request, "Invalid credentials. Please try again.")
            return render(request, 'outreach/login.html')  # Or whatever template you're using

    return render(request, 'outreach/login.html')

    

@login_required
def logout_view(request):
    logout(request)
    return redirect('index')  
    


def donate_page(request):
    return render(request, "outreach/donate.html")

def donate2(request):
    return render(request, "outreach/donate2.html")

def redirect_donation(request, donation_type):
    if donation_type == "one-time":
        return redirect("donate_one_time")
    elif donation_type == "monthly":
        return redirect("donate_monthly")
    else:
        return redirect("donate2")


def donate_one_time(request):
    """Renders the donation page for one-time donations."""
    return render(request, "outreach/donate_one_time.html")  


def donate_monthly(request):
    """Renders the donation page for monthly donations."""
    return render(request, "outreach/donate_monthly.html")  


# Process the Donation 
@login_required
def process_donation(request):
    if request.method == "POST":
        donation_type = request.POST.get("donation_type", "one-time")
        amount = request.POST.get("amount")

        # Validate amount
        try:
            amount = float(amount)
            if amount <= 0:
                return JsonResponse({"success": False, "error": "Amount must be greater than zero"}, status=400)
        except (ValueError, TypeError):
            return JsonResponse({"success": False, "error": "Invalid amount format"}, status=400)

        name = request.user.get_full_name() or request.user.username
        email = request.user.email

        # Save donation before processing payment
        donation = Donation.objects.create(
            user=request.user,
            amount=amount,
            donation_type=donation_type,
            email=email,
            status="pending"
        )

        # Prepare payment request
        payment_data = {
            "tx_ref": f"donation_{donation.id}",
            "amount": amount,
            "currency": "USD",
            "payment_options": "card,banktransfer,ussd",
            "redirect_url": request.build_absolute_uri(reverse('donation_confirm')),
            "customer": {
                "email": email,
                "name": name,
            },
            "customizations": {
                "title": "Christ City Donation",
                "description": f"Donation - {donation_type.capitalize()}",
            },
        }

        headers = {
            "Authorization": f"Bearer {settings.FLW_SECRET_KEY}",
            "Content-Type": "application/json",
        }

        # Debug request before sending
        print("Sending payment request to Flutterwave...")
        print("Headers:", headers)
        print("Payment Data:", payment_data)

        response = requests.post(
            "https://api.flutterwave.com/v3/payments",
            json=payment_data,
            headers=headers
        )

        # Debug response
        print("Flutterwave Response Code:", response.status_code)
        print("Flutterwave Response:", response.json())
        print("Redirect URL:", request.build_absolute_uri(reverse('donation_confirm')))


        res_data = response.json()

        if res_data.get("status") == "success":
            return JsonResponse({"success": True, "redirect_url": res_data["data"]["link"]})
        else:
            return JsonResponse({"success": False, "error": f"Payment initiation failed: {res_data}"}, status=400)

    return JsonResponse({"success": False, "error": "Invalid request method"}, status=400)


# Handle Flutterwave Webhook (Confirm Payment Status)
@csrf_exempt
def flutterwave_webhook(request):
    """Handles Flutterwave payment confirmation via webhook."""
    if request.method == "POST":
        try:
            payload = json.loads(request.body)
            tx_ref = payload.get("tx_ref")
            flw_transaction_id = payload.get("id")  
            status = payload.get("status")

            # Verify transaction with Flutterwave API
            FLUTTERWAVE_VERIFY_URL = f"https://api.flutterwave.com/v3/transactions/{flw_transaction_id}/verify"
            headers = {"Authorization": f"Bearer {settings.FLW_SECRET_KEY}"}
            verify_response = requests.get(FLUTTERWAVE_VERIFY_URL, headers=headers)
            verify_data = verify_response.json()

            if verify_data.get("status") != "success":
                return JsonResponse({"error": "Transaction verification failed"}, status=400)

            # Update Donation Status in Database
            donation_id = int(tx_ref.split("_")[1])
            donation = get_object_or_404(Donation, id=donation_id)

            if status == "successful":
                donation.status = "completed"
                donation.save()
                return JsonResponse({"message": "Payment confirmed"}, status=200)

            return JsonResponse({"error": "Payment not successful"}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)


# Final Confirmation View After Payment
@csrf_exempt
def donation_confirm(request):
    """Handles post-payment confirmation and displays the success page."""
    try:
        if request.method == "POST":
            data = json.loads(request.body)
            transaction_id = data.get("transaction_id")

            if not transaction_id:
                return JsonResponse({"error": "Transaction ID is missing"}, status=400)

            # Verify the payment with Flutterwave
            verify_url = f"https://api.flutterwave.com/v3/transactions/{transaction_id}/verify"
            headers = {"Authorization": f"Bearer {settings.FLW_SECRET_KEY}", "Content-Type": "application/json"}
            response = requests.get(verify_url, headers=headers)
            response_data = response.json()

            if response_data.get("status") == "success":
                amount = response_data["data"]["amount"]
                currency = response_data["data"]["currency"]
                donor_email = response_data["data"]["customer"]["email"]

                return render(request, "donation_success.html", {
                    "amount": amount,
                    "currency": currency,
                    "email": donor_email
                })
            else:
                return JsonResponse({"error": "Payment verification failed"}, status=400)

        return JsonResponse({"error": "Invalid request method"}, status=405)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



def blog_list(request):
    posts = BlogPost.objects.exclude(slug='').order_by('-created_at')
    recent_posts = posts[:5]
    
    context = {
        'posts': posts,
        'recent_posts': recent_posts,
    }
    return render(request, 'outreach/blog.html', context)

def blog_detail(request, slug):
    post = get_object_or_404(BlogPost, slug=slug)
    comments = Comment.objects.filter(post=post).order_by('-created_at')  # Fetch comments for the post
    recent_posts = BlogPost.objects.all().order_by('-created_at')[:5]  # Fetch recent posts for the sidebar

    print(f"Found {comments.count()} comments for post: {post.title}")
    for comment in comments:
        print(f"Comment by {comment.user.username}: {comment.content[:30]}...")

    context = {
        'post': post,
        'comments': comments,  # Pass comments to the template
        'recent_posts': recent_posts,
    }
    return render(request, "outreach/posts.html", context)


@login_required
def add_comment(request, post_id):
    post = get_object_or_404(BlogPost, id=post_id)

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            comment_text = data.get("text", "").strip()

            if not comment_text:
                return JsonResponse({"success": False, "error": "Comment cannot be empty."}, status=400)

            comment = Comment.objects.create(post=post, user=request.user, content=comment_text)

            return JsonResponse({
                "success": True,
                "username": comment.user.username,
                "text": comment.content,
                "created_at": comment.created_at.strftime("%b %d, %Y %I:%M %p")
            })
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON data."}, status=400)

    return JsonResponse({"success": False, "error": "Invalid request."}, status=400)


@login_required
def create_blog_post(request):
    if request.method == "POST":
        form = BlogPostForm(request.POST, request.FILES)
        if form.is_valid():
            blog_post = form.save(commit=False)
            blog_post.author = request.user
            blog_post.save()
            messages.success(request, "Your blog post has been published!")
            return redirect('blog_list')
    else:
        form = BlogPostForm()
    return render(request, 'create_post.html', {'form': form})


@login_required
def delete_blog_post(request, slug):
    post = get_object_or_404(BlogPost, slug=slug)
    if request.user.is_superuser or request.user == post.author:
        post.delete()
        messages.success(request, "Blog post deleted successfully.")
    else:
        messages.error(request, "You are not authorized to delete this post.")
    return redirect('blog_list')


def blog_search(request):
    query = request.GET.get('q', '')
    if query:
        posts = BlogPost.objects.filter(
            Q(title__icontains=query) | 
            Q(content__icontains=query)
        )
    else:
        posts = BlogPost.objects.none()
    
    context = {
        'query': query,
        'posts': posts,
    }
    return render(request, 'outreach/blog_search.html', context)


@login_required
def create_blog_post(request):
    if request.method == "POST":
        form = BlogPostForm(request.POST)
        files = request.FILES.getlist('images')  # Get multiple uploaded images

        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user  # Set the current user as author
            post.save()  
            blog_post = form.save()  # Save the blog post first

            # Save each uploaded image
            for file in files:
                BlogPostImage.objects.create(blog_post=blog_post, image=file)

            messages.success(request, "Blog post created successfully with images!")
            return redirect("blog_list")

    else:
        form = BlogPostForm()

    return render(request, "outreach/create_blog.html", {"form": form})

@login_required
def like_comment(request, comment_id):
    comment = get_object_or_404(Comment, id=comment_id)
    
    if request.user in comment.likes.all():
        comment.likes.remove(request.user)
        liked = False
    else:
        comment.likes.add(request.user)
        liked = True
    
    return JsonResponse({"liked": liked, "total_likes": comment.total_likes()})

@login_required
def like_post(request, post_id):
    post = get_object_or_404(BlogPost, id=post_id)

    if request.user in post.likes.all():
        post.likes.remove(request.user)  # Unlike
        liked = False
    else:
        post.likes.add(request.user)  # Like
        liked = True

    return JsonResponse({"liked": liked, "likes_count": post.likes.count()})

@login_required
def reply_comment(request, comment_id):
    parent_comment = get_object_or_404(Comment, id=comment_id)
    
    if request.method == "POST":
        reply_content = request.POST.get("reply_content")
        if reply_content:
            reply = Comment.objects.create(
                listing=parent_comment.listing,
                commenter=request.user,
                content=reply_content,
                parent=parent_comment
            )
            return JsonResponse({
                "commenter": request.user.username,
                "content": reply.content,
                "created_at": reply.created_at.strftime("%b %d, %Y %I:%M %p")
            })
    
    return JsonResponse({"error": "Invalid request"}, status=400)
