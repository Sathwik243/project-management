document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById("register-form");

    // Event listener for form submission
    registerForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const userName = document.getElementById("username").value;
        const userID = document.getElementById("collegeID").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const role = document.getElementById("role").value;
        const phoneNumber = document.getElementById("phoneNumber").value;

        // Basic validation
        if (!userName || !email || !password || !confirmPassword || !role) {
            alert("Please fill in all fields.");
            return;
        }
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!emailRegex.test(email) || !email.endsWith('.com')) {
            alert('Please enter a valid email address that contains "@" and ends with ".com".');
            return;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const newUser = {
            userID: userID,
            email: email,
            password: password,
            role: role
        };

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registration successful! Please login.");
                window.location.href = "login.html";
            } else {
                alert(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
