const logForm = document.getElementById('Form');

if (logForm) {
    logForm.innerHTML =
        `<h1>Login</h1>
    <form id="loginFormActual">
        <div>
            <input id="userInputName" name="username" type="text" placeholder="Username" autocomplete="username"/>
        </div>
        <div class="password-container">
            <input id="userPasswordInput" name="password" type="password" placeholder="Password" autocomplete="current-password"/>
            <span id="togglePassword" name="eyeIcon">👁️</span>
        </div>
        <div>
            <button id="submitButton" type="submit" name="submitLogin">Submit</button>
        </div>
    </form>`;

    // Get references to the elements AFTER they have been added to the DOM
    const userInputName = document.getElementById('userInputName');
    const userPasswordInput = document.getElementById('userPasswordInput');
    const submitButton = document.getElementById('submitButton'); // This variable is not strictly needed if only attaching to form
    const togglePassword = document.getElementById('togglePassword');
    const actualLoginForm = document.getElementById('loginFormActual'); // CORRECT: Get the form element

    let API_BASE_URL;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        API_BASE_URL = 'http://localhost:3000';
    } else {
        API_BASE_URL = 'https://opu-webapps.netlify.app/';
    }

    async function handleSubmit(event) {
        event.preventDefault(); // Prevents default form submission

        const name = userInputName.value;
        const password = userPasswordInput.value;

        if (!name || !password) {
            alert('Please enter both username and password.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/logForm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    password: password
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Submission successful:', data);
                alert('Login successful and data saved!');

                userInputName.value = '';
                userPasswordInput.value = '';

            } else {
                const errorData = await response.json(); // Ensure this always works, even on 400/500
                console.error('Failed to submit form:', response.status, errorData);
                alert(`Error: ${errorData.error || response.statusText || 'An unknown error occurred.'}`);
            }

        } catch (error) {
            console.error('Error while submitting form:', error);
            alert('An unexpected error occurred: Please try again later.');
        }
    }

    // This is the correct place for the event listener:
    if (actualLoginForm) { // Ensure the actual form element exists
        actualLoginForm.addEventListener('submit', handleSubmit);
    } else {
        console.error("The actual login form element with ID 'loginFormActual' was not found.");
    }


    // Password show/hide toggle logic
    if (togglePassword && userPasswordInput) {
        togglePassword.addEventListener('click', function () {
            const type = userPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            userPasswordInput.setAttribute('type', type);
            this.textContent = (type === 'password' ? '👁️' : '🔒');
        });
    }

} else {
    console.error("The element with ID 'Form' was not found in the DOM.");
}