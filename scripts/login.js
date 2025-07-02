document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const responseMessage = document.getElementById('responseMessage');

    if (!loginForm || !emailInput || !passwordInput || !loginButton || !responseMessage) {
        console.error('Login form elements not found.');
        return;
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        responseMessage.textContent = '';
        responseMessage.className = 'message';

        if (!email || !password) {
            responseMessage.textContent = 'Please enter both email and password.';
            responseMessage.classList.add('error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            responseMessage.textContent = 'Please enter a valid email address.';
            responseMessage.classList.add('error');
            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';

        try {
            const response = await axios.post(
                'http://localhost/Cinema-server/controllers/login.php',
                {
                    email: email,
                    password: password
                }
            );

            const data = response.data;

            if (data.status === 200) {
                responseMessage.textContent = data.message || 'Login successful!';
                responseMessage.classList.add('success');

                // console.log("Login successful! User data:", data.user);

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                responseMessage.textContent = data.message || 'Login failed. Invalid credentials.';
                responseMessage.classList.add('error');
            }

        } catch (error) {
            if (error.response) {
                responseMessage.textContent = error.response.data.message || `Server error: ${error.response.status}`;
                console.error('Login error (Server Response):', error.response.status, error.response.data);
            } else if (error.request) {
                responseMessage.textContent = 'Network error. Please check your internet connection or server.';
                console.error('Login error (No Response):', error.request);
            } else {
                responseMessage.textContent = 'An unexpected error occurred.';
                console.error('Login error (Request Setup):', error.message);
            }
            responseMessage.classList.add('error');
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
        }
    });
});