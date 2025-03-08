document.addEventListener("DOMContentLoaded", function () {
    const authContainer = document.querySelector(".auth-wrapper");
    const authButtons = document.querySelectorAll(".auth-btn");
    const authInputs = document.querySelectorAll(".auth-input");
    const toggleButton = document.querySelector(".toggle");
    

    // Smooth button press effect
    authButtons.forEach(button => {
        button.addEventListener("mousedown", function () {
            this.style.transform = "scale(0.95)";
        });
        button.addEventListener("mouseup", function () {
            this.style.transform = "scale(1)";
        });
    });

    toggleButton.addEventListener("click", function () {
        if (container.style.transform === "translateX(0%)") {
            container.style.transform = "translateX(-50%)";
            toggleButton.textContent = "Switch to Login";
        } else {
            container.style.transform = "translateX(0%)";
            toggleButton.textContent = "Switch to Register";
        }
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


document.addEventListener("DOMContentLoaded", function () {
    // Select all donation boxes
    const donationBoxes = document.querySelectorAll(".donation-box");

    donationBoxes.forEach(box => {
        // Hover Animation
        box.addEventListener("mouseenter", function () {
            box.style.transform = "scale(1.05)";
            box.style.boxShadow = "0px 10px 25px rgba(0, 0, 0, 0.4)";
        });

        box.addEventListener("mouseleave", function () {
            box.style.transform = "scale(1)";
            box.style.boxShadow = "0px 8px 20px rgba(0, 0, 0, 0.2)";
        });

        // On click, highlight the selected box
        box.addEventListener("click", function () {
            donationBoxes.forEach(item => {
                item.style.background = "rgba(255, 255, 255, 0.9)";
                item.style.transform = "scale(1)";
            });

            this.style.background = "#ffddc1";
            this.style.transform = "scale(1.08)";
        });
    });

    // Donation Amount Input Validation
    const donationInputs = document.querySelectorAll(".donation-input");

    donationInputs.forEach(input => {
        input.addEventListener("input", function () {
            let value = parseFloat(this.value);
            if (isNaN(value) || value <= 0) {
                this.style.borderColor = "red";
            } else {
                this.style.borderColor = "#28a745";
            }
        });
    });

    // Submit Button Animation
    const donateButtons = document.querySelectorAll(".donate-btn");

    donateButtons.forEach(button => {
        button.addEventListener("mousedown", function () {
            this.style.transform = "scale(0.95)";
        });

        button.addEventListener("mouseup", function () {
            this.style.transform = "scale(1)";
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const donateBoxes = document.querySelectorAll(".donate-box");

    donateBoxes.forEach((box) => {
        box.addEventListener("mouseenter", () => {
            donateBoxes.forEach((otherBox) => {
                if (otherBox !== box) {
                    otherBox.style.opacity = "0.5";
                }
            });
        });

        box.addEventListener("mouseleave", () => {
            donateBoxes.forEach((otherBox) => {
                otherBox.style.opacity = "1";
            });
        });
    });
});


document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", function(event) {
            event.preventDefault();  // Stop default form submission

            let formData = new FormData(this);
            let submitButton = this.querySelector("button");
            submitButton.disabled = true;  // Disable button while processing

            fetch("/donate/process/", {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect_url;  // ✅ Redirect to Flutterwave
                } else {
                    alert("Error: " + data.error);  // Show error message
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An unexpected error occurred.");
            })
            .finally(() => {
                submitButton.disabled = false;  // Re-enable button
            });
        });
    });
});



