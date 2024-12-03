// /front end/js/login.js
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");

    // Event listener for login form submission
    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const userID = document.getElementById("userID").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;


        // Basic validation
        if (!userID || !password || !role) {
            alert("Please fill all fields.");
            return;
        }

        const userCredentials = {
            userID: userID,
            password: password,
            role: role
        };

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userCredentials)
            });

           

            if (response.ok) {
                const data = await response.json();
                alert("Login successful!");
                console.log(data);
                const token = data.token;  // Extract token from the response
                localStorage.setItem('token', token);  
                 if(data.user.role == "lecturer") {
                // Redirect based on user type (student/lecturer)
                window.location.href = "Lecturer_dashboard.html";
                   }
                  else {
                         window.location.href = "Student_Dashboard.html";
                   }
                
            } else {
                alert( "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
