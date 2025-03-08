// Create this file at /static/js/donate.js

document.addEventListener("DOMContentLoaded", function() {
    // Highlight selected donation amounts when clicked
    const amountInputs = document.querySelectorAll('.donation-input');
    
    amountInputs.forEach(input => {
        // Add focus event handler
        input.addEventListener('focus', function() {
            // Remove highlight from all donation boxes
            document.querySelectorAll('.donation-box').forEach(box => {
                box.classList.remove('selected');
            });
            
            // Add highlight to parent donation box
            this.closest('.donation-box').classList.add('selected');
        });
        
        // Set predefined amounts if available
        const presetAmount = input.closest('.pricing-box-alt').querySelector('.pricing-terms h6');
        if (presetAmount && !isNaN(parseFloat(presetAmount.textContent))) {
            const amount = parseFloat(presetAmount.textContent.replace(/[^0-9.]/g, ''));
            if (amount > 0) {
                input.value = amount;
            }
        }
    });
    
    // Handle form submissions
    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", function(event) {
            event.preventDefault();  // Stop default form submission
    
            let formData = new FormData(this);
            let submitButton = this.querySelector("button");
            submitButton.disabled = true;  // Disable button while processing
            submitButton.innerHTML = '<i class="icon-spinner icon-spin"></i> Processing...';
    
            fetch(this.action, {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect_url;  // Redirect to Flutterwave
                } else {
                    alert("Error: " + (data.error || "Unknown error"));  // Show error message
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<i class="icon-bolt"></i> Try Again';
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An unexpected error occurred. Please try again.");
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="icon-bolt"></i> Try Again';
            });
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





