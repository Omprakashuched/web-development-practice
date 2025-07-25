const logForm = document.getElementById('Form');

// Ensure the form element exists before manipulating it
if (logForm) {
    logForm.innerHTML =
        `<h1>Login</h1>
<div>
    <input id="userInputName" name="username" type="text" placeholder="Username"/>
</div>
<div class="password-container">
    <input id="userInputPassword" name="password" type="password" placeholder="Password"/>
    <span class="toggle-password" id="togglePassword">👁️</span>
</div>
<div>
    <button id="submitButton" type="submit">Submit</button>
</div>`;

    // Get references to the elements AFTER they have been added to the DOM
    const userInputName = document.getElementById('userInputName');
    const userInputPassword = document.getElementById('userInputPassword');
    const submitButton = document.getElementById('submitButton');
    const togglePassword = document.getElementById('togglePassword'); // This must be inside the `if (logForm)` block

    // CORRECTED: How to get the API_BASE_URL for plain JS without a build tool.
    // Use window.location.hostname for dynamic URL based on environment.
    let API_BASE_URL;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        API_BASE_URL = 'http://localhost:3000'; // Your local backend port
    } else {
        // Replace with your deployed backend URL when in production (e.g., from Render)
        API_BASE_URL = 'https://opu-webapps.netlify.app/';
    }


    async function handleSubmit(event) {
        event.preventDefault();

        const name = userInputName.value;
        const password = userInputPassword.value;

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
                // Include additionalInfo for the text file if needed by your backend
                body: JSON.stringify({
                    name: name,
                    password: password,
                    // If your backend expects 'additionalInfo' for the text file, include it here
                    // additionalInfo: `User ${name} logged in at ${new Date().toLocaleString()}`
                })
            });

            if (response.ok) {
                const data = await response.json(); // It's good practice to always parse the response, even if you don't use it directly
                console.log('Submission successful:', data);
                alert('Login successful and data saved!'); // More specific alert

                userInputName.value = ''; // Clear fields on success
                userInputPassword.value = '';

            } else {
                const errorData = await response.json();
                console.error('Failed to submit form:', response.status, errorData);
                alert(`Error: ${errorData.error || response.statusText || 'An unknown error occurred.'}`);
            }

        } catch (error) {
            console.error('Error while submitting form:', error);
            alert('An unexpected error occurred: Please try again later.');
        }
    };

    // Add event listener to the form's submit event for robustness
    if (submitButton) {
        submitButton.addEventListener('submit', handleSubmit);
    }

    // Password show/hide toggle logic - now inside the `if (logForm)` block
    if (togglePassword && userInputPassword) {
        togglePassword.addEventListener('click', function () {
            const type = userInputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            userInputPassword.setAttribute('type', type);
            this.textContent = (type === 'password' ? '👁️' : '🔒');
        });
    }

} else {
    console.error("The element with ID 'Form' was not found in the DOM.");
}
