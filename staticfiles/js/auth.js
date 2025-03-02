// JavaScript to Toggle Between Sign In & Sign Up Forms
function toggleAuth() {
    document.querySelector(".sign-in-form").classList.toggle("active");
    document.querySelector(".sign-up-form").classList.toggle("active");
}

// Ensure Sign In is active on page load
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".sign-in-form").classList.add("active");
});

document.addEventListener("DOMContentLoaded", function() {
    function toggleAuth() {
        document.querySelector(".auth-box").classList.toggle("active");
    }

    document.querySelectorAll(".toggle-text span").forEach(span => {
        span.addEventListener("click", toggleAuth);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.querySelector(".auth-box form");

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        let username = document.getElementById("username").value;
        let email = document.getElementById("email").value;
        let password1 = document.getElementById("password1").value;
        let password2 = document.getElementById("password2").value;

        if (password1 !== password2) {
            alert("Passwords do not match!");
            return;
        }

        this.submit();
    });
});

