document.addEventListener("DOMContentLoaded", function() {
    // Highlight selected donation amounts when clicked
    const amountInputs = document.querySelectorAll('.donation-input');

    amountInputs.forEach(input => {
        // Add focus event handler
        input.addEventListener('focus', function() {
            document.querySelectorAll('.donation-box').forEach(box => {
                box.classList.remove('selected');
            });

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
        box.addEventListener("mouseenter", function () {
            this.style.transform = "scale(1.05)";
            this.style.boxShadow = "0px 10px 25px rgba(0, 0, 0, 0.4)";
        });

        box.addEventListener("mouseleave", function () {
            this.style.transform = "scale(1)";
            this.style.boxShadow = "0px 8px 20px rgba(0, 0, 0, 0.2)";
        });

        box.addEventListener("click", function () {
            donationBoxes.forEach(item => {
                item.style.background = "rgba(255, 255, 255, 0.9)";
                item.style.transform = "scale(1)";
            });

            this.style.background = "#ffddc1";
            this.style.transform = "scale(1.08)";
        });
    });

    // ✅ Donation form submission (handles redirection to Flutterwave)
    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent default form submission

            let amountInput = this.querySelector('input[name="amount"]');
            let donationTypeInput = this.querySelector('input[name="donation_type"]');
            let submitButton = this.querySelector("button");

            // Validate amount
            let amount = parseFloat(amountInput.value);
            if (!amount || isNaN(amount) || amount <= 0) {
                alert("Please enter a valid donation amount greater than $0.");
                return;
            }

            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="icon-spinner icon-spin"></i> Processing...';

            fetch("process_donation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken") // Get CSRF token for Django
                },
                body: JSON.stringify({ amount: amount, donation_type: donationType.value })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Response from server:", data); // debugging
                if (data.success && data.redirect_url) {
                    window.location.href = data.redirect_url;  //  Redirect to Flutterwave
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

    // Function to get CSRF token from cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            let cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.startsWith(name + "=")) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
