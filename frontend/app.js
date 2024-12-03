// app.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutButton = document.getElementById('logoutButton');
    const userInfo = document.getElementById('userInfo');
    const errorMessage = document.getElementById('errorMessage');

    // Check user session when the page loads
    const checkUser Session = async () => {
        try {
            const response = await fetch('/api/auth/user', {
                method: 'GET',
                credentials: 'include', // Include cookies in the request
            });
            if (response.ok) {
                const user = await response.json();
                userInfo.textContent = `Hello, ${user.name}`;
                userInfo.style.display = 'block';
                logoutButton.style.display = 'block';
            } else {
                throw new Error('User  not authenticated');
            }
        } catch (error) {
            console.error('Error checking user session:', error);
        }
    };

    // Handle user login
    const handleLogin = async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies in the request
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const user = await response.json();
                window.location.href = 'dashboard.html'; // Redirect to dashboard
            } else {
                const errorData = await response.json();
                errorMessage.textContent = errorData.message || 'Login failed';
            }
        } catch (error) {
            console.error('Error during login:', error);
            errorMessage.textContent = 'An error occurred. Please try again.';
        }
    };

    // Handle user registration
    const handleRegister = async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                alert('Registration successful! You can now log in.');
                window.location.href = 'login.html'; // Redirect to login page
            } else {
                const errorData = await response.json();
                errorMessage.textContent = errorData.message || 'Registration failed';
            }
        } catch (error) {
            console.error('Error during registration:', error);
            errorMessage.textContent = 'An error occurred. Please try again.';
        }
    };

    // Handle user logout
    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include', // Include cookies in the request
            });
            userInfo.style.display = 'none';
            logoutButton.style.display = 'none';
            window.location.href = 'index.html'; // Redirect to home page
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    // Event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Check user session on page load
    checkUser Session();
});