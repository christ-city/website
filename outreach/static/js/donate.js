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
        if (presetAmount && presetAmount.textContent.includes('$')) {
            const amountText = presetAmount.textContent;
            const amount = parseFloat(amountText.replace(/[^0-9.]/g, ''));
            if (amount > 0) {
                input.value = amount;
            }
        }
    });
    
    // Animation effects for donation boxes
    const donationBoxes = document.querySelectorAll(".pricing-box-alt");
    donationBoxes.forEach(box => {
        // Hover Animation
        box.addEventListener("mouseenter", function () {
            this.style.transform = "scale(1.05)";
            this.style.boxShadow = "0px 10px 25px rgba(0, 0, 0, 0.4)";
        });

        box.addEventListener("mouseleave", function () {
            this.style.transform = "scale(1)";
            this.style.boxShadow = "0px 8px 20px rgba(0, 0, 0, 0.2)";
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

    // Form submission handler
    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            
            const amount = this.querySelector('input[name="amount"]').value;
            if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
                alert("Please enter a valid donation amount greater than zero.");
                return;
            }
            
            let formData = new FormData(this);
            let submitButton = this.querySelector("button");
            
            // Update button state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="icon-spinner icon-spin"></i> Processing...';
            
            // Send the request
            fetch(this.action, {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect_url;  // Redirect to Flutterwave
                } else {
                    alert("Error: " + (data.error || "Unknown error"));
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("An unexpected error occurred. Please try again.");
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="icon-bolt"></i> Donate Now';
            });
        });
    });
});





