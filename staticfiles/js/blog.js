document.addEventListener("DOMContentLoaded", function () {
    const readMoreLinks = document.querySelectorAll(".read-more");

    readMoreLinks.forEach(link => {
        link.addEventListener("mouseenter", () => {
            link.style.transform = "scale(1.05)";
        });

        link.addEventListener("mouseleave", () => {
            link.style.transform = "scale(1)";
        });
    });

    const sidebarLinks = document.querySelectorAll(".sidebar-widget ul li a");

    sidebarLinks.forEach(link => {
        link.addEventListener("mouseover", () => {
            link.style.opacity = "0.7";
        });

        link.addEventListener("mouseout", () => {
            link.style.opacity = "1";
        });
    });
});

(function() {
    // HANDLE COMMENT SUBMISSION
    const submitCommentBtn = document.querySelector("#submit-comment");
    if (submitCommentBtn) {
        submitCommentBtn.addEventListener("click", function (event) {
            const postId = event.target.dataset.postId;
            const commentText = document.querySelector("#comment-text").value.trim();

            if (!commentText) {
                alert("Please write a comment.");
                return;
            }

            fetch(`/blog/${postId}/comment/`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCSRFToken(),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text: commentText })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const commentList = document.querySelector("#comments-list");
                    
                    // Remove "no comments" message if it exists
                    const noCommentsMsg = document.querySelector("#no-comments-message");
                    if (noCommentsMsg) {
                        noCommentsMsg.remove();
                    }
                    
                    const newComment = document.createElement("div");
                    newComment.classList.add("comment");
                    newComment.innerHTML = `
                        <strong>${data.username}</strong>: ${data.text}
                        <span class="comment-date">${data.created_at}</span>
                    `;
                    commentList.prepend(newComment);

                    // Increase the comment count
                    const commentCountEl = document.querySelector("#comment-count");
                    if (commentCountEl) {
                        const currentCount = parseInt(commentCountEl.textContent, 10);
                        if (!isNaN(currentCount)) {
                            commentCountEl.textContent = currentCount + 1;
                        }
                    }

                    // Clear input field
                    document.querySelector("#comment-text").value = "";
                } else {
                    alert("Error posting comment: " + (data.error || "Unknown error"));
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Something went wrong. Please try again.");
            });
        });
    }

    // HANDLE LIKE BUTTON CLICK
    const likeBtn = document.querySelector(".like-btn");
    if (likeBtn) {
        likeBtn.addEventListener("click", function () {
            const postId = this.dataset.postId;

            fetch(`/blog/${postId}/like/`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCSRFToken(),
                    "Content-Type": "application/json"
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Update like count
                const likeCountEl = document.querySelector("#like-count");
                if (likeCountEl) {
                    likeCountEl.textContent = data.likes_count;
                }
                
                // Update heart icon based on like status
                if (data.liked) {
                    this.innerHTML = `❤️ <span class="like-count">${data.likes_count}</span> Likes`;
                } else {
                    this.innerHTML = `🤍 <span class="like-count">${data.likes_count}</span> Likes`;
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error updating like status. You may need to log in first.");
            });
        });
    }

    // FUNCTION TO GET CSRF TOKEN
    function getCSRFToken() {
        const csrfTokenInput = document.querySelector('input[name=csrfmiddlewaretoken]');
        if (!csrfTokenInput) {
            console.error("CSRF token input not found!");
            return '';
        }
        return csrfTokenInput.value;
    }
})();

function addNewComment(author, content) {
    const commentSection = document.querySelector('.comment-section');
    const newComment = document.createElement('div');
    newComment.className = 'comment comment-new';
    
    const time = new Date();
    const timeString = time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    newComment.innerHTML = `
      <div class="comment-author">${author}</div>
      <div class="comment-time">Today at ${timeString}</div>
      <div class="comment-content">${content}</div>
    `;
    
    commentSection.appendChild(newComment);
    
    // Scroll to the bottom to show the new comment
    commentSection.scrollTop = commentSection.scrollHeight;
  }