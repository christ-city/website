document.addEventListener("DOMContentLoaded", function () {
    const authContainer = document.querySelector(".auth-wrapper");
    const authButtons = document.querySelectorAll(".auth-btn");
    const authInputs = document.querySelectorAll(".auth-input");
    
    

    // Smooth button press effect
    authButtons.forEach(button => {
        button.addEventListener("mousedown", function () {
            this.style.transform = "scale(0.95)";
        });
        button.addEventListener("mouseup", function () {
            this.style.transform = "scale(1)";
        });
    });

    
    // Input field animations
    authInputs.forEach(input => {
        input.addEventListener("focus", function () {
            this.style.borderColor = "white";
            this.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.5)";
        });
        input.addEventListener("blur", function () {
            this.style.borderColor = "transparent";
            this.style.boxShadow = "none";
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const donationBoxes = document.querySelectorAll(".donation-box");

    donationBoxes.forEach(box => {
        box.addEventListener("click", function () {
            // Remove active class from all boxes
            donationBoxes.forEach(b => b.classList.remove("active"));
            donationBoxes.forEach(b => b.classList.add("inactive"));

            // Add active class to clicked box
            this.classList.add("active");
            this.classList.remove("inactive");
        });
    });

    // Reset blur effect when mouse leaves
    document.body.addEventListener("click", function (event) {
        if (!event.target.closest(".donation-box")) {
            donationBoxes.forEach(b => b.classList.remove("inactive", "active"));
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown > a");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", function (e) {
            e.preventDefault(); // Prevent page jump

            let parent = this.parentElement;

            // Close all other dropdowns
            document.querySelectorAll(".dropdown").forEach(drop => {
                if (drop !== parent) drop.classList.remove("active");
            });

            // Toggle current dropdown
            parent.classList.toggle("active");
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
        if (!e.target.closest(".dropdown")) {
            document.querySelectorAll(".dropdown").forEach(drop => {
                drop.classList.remove("active");
            });
        }
    });
});


