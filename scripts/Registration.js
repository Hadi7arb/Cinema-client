document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const fullNameInput = document.getElementById('fullName');
    const mobileNumberInput = document.getElementById('mobileNumber');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const responseMessage = document.getElementById('responseMessage');
    const registerButton = document.getElementById('registerButton');

    if (!registrationForm || !fullNameInput || !mobileNumberInput || !emailInput || !passwordInput || !confirmPasswordInput || !responseMessage || !registerButton) {
        console.error('Registration form elements not found.');
        return;
    }

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fullName = fullNameInput.value.trim();
        const mobileNumber = mobileNumberInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        responseMessage.textContent = '';
        responseMessage.className = 'message';

        if (!fullName || !mobileNumber || !email || !password || !confirmPassword) {
            responseMessage.textContent = 'All fields are required.';
            responseMessage.classList.add('error');
            return;
        }

        if (password !== confirmPassword) {
            responseMessage.textContent = 'Passwords do not match.';
            responseMessage.classList.add('error');
            return;
        }

        if (password.length < 6) {
            responseMessage.textContent = 'Password must be at least 6 characters long.';
            responseMessage.classList.add('error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            responseMessage.textContent = 'Please enter a valid email address.';
            responseMessage.classList.add('error');
            return;
        }

        const mobileRegex = /^\d{8,}$/;
        if (!mobileRegex.test(mobileNumber)) {
            responseMessage.textContent = 'Please enter a valid mobile number (e.g., 8 digits or more).';
            responseMessage.classList.add('error');
            return;
        }

        registerButton.disabled = true;
        registerButton.textContent = 'Registering...';

        try {
            const response = await axios.post(
                'http://localhost/Cinema-server/controllers/register.php',
                {
                    // CRITICAL CHANGE: Keys now match database column names
                    name: fullName,       // 'name' column in DB
                    mobile: mobileNumber, // 'mobile' column in DB
                    email: email,         // 'email' column in DB
                    password: password    // 'password' column in DB (remember to hash in PHP!)
                }
            );

            const data = response.data;

            if (data.status === 200) {
                responseMessage.textContent = data.message;
                responseMessage.classList.add('success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                responseMessage.textContent = data.message || 'Registration failed. Please try again.';
                responseMessage.classList.add('error');
            }

        } catch (error) {
            if (error.response) {
                responseMessage.textContent = error.response.data.message || 'Server error during registration.';
                console.error('Registration error (Server Response):', error.response.status, error.response.data);
            } else if (error.request) {
                responseMessage.textContent = 'Network error. Please check your internet connection or server.';
                console.error('Registration error (No Response):', error.request);
            } else {
                responseMessage.textContent = 'An unexpected error occurred during request setup.';
                console.error('Registration error (Request Setup):', error.message);
            }
            responseMessage.classList.add('error');
        } finally {
            registerButton.disabled = false;
            registerButton.textContent = 'Register';
        }
    });
});