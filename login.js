const logForm = document.getElementById('Form');

// Ensure the form element exists before manipulating it
if (logForm) {
    logForm.innerHTML =
        `<h1>Login</h1>
<div>
    <input id="userInputName" type="text" placeholder="Username"/>
</div>
<div class="password-container"> <input id="userInputPassword" type="password" placeholder="Password"/>
    <span class="toggle-password" id="togglePassword">👁️</span> </div>
<div>
    <button id="submitButton" type="submit">Submit</button>
</div>`;

    // Get references to the elements AFTER they have been added to the DOM
    const userInputName = document.getElementById('userInputName');
    const userInputPassword = document.getElementById('userInputPassword');
    const submitButton = document.getElementById('submitButton');
    const togglePassword = document.getElementById('togglePassword');


    // Add event listener to the form's submit event
    // This is generally better for forms, as it handles both button clicks and pressing enter
    async function handleSubmit(event) { // Made the function async directly here
        event.preventDefault(); // Prevent default form submission behavior (page reload)

        const name = userInputName.value;
        const password = userInputPassword.value;

        // Basic client-side validation
        if (!name || !password) {
            alert('Please enter both username and password.');
            return; // Stop the function if fields are empty
        }

        try {
            const response = await fetch(`https://opu-webapps.netlify.app/api/logForm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // CORRECTED: Proper spelling and syntax
                },
                body: JSON.stringify({ name: name, password: password }) // CORRECTED: Sending values
            });

            if (response.ok) {
                // const data = await response.json(); // Parse the successful response
                // console.log('Login successful:', data);
                // alert('Login successful!');

                userInputName.value = ''; // Clear fields on success
                userInputPassword.value = '';
                // Optionally, redirect user or show success message
            } else {
                const errorData = await response.json(); // Parse error message from backend
                console.error('Failed to submit form:', response.status, errorData);
                alert(`Error: ${errorData.error || response.statusText || 'An unknown error occurred.'}`);
            }

        } catch (error) {
            console.error('Error while submitting form:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    // Optional: Add input change listeners if needed for real-time feedback
    if (submitButton) {
        submitButton.addEventListener('click', handleSubmit);
    }

    // if (userInputPassword) {
    //     userInputPassword.addEventListener('input', () => {
    //         // console.log('Password input changed:', userInputPassword.value);
    //         // Add client-side validation logic here
    //     });
    // }

} else {
    console.error("The element with ID 'Form' was not found in the DOM.");
}

if (togglePassword && userInputPassword) {
    togglePassword.addEventListener('click', function () {
        // Toggle the type attribute
        const type = userInputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        userInputPassword.setAttribute('type', type);

        // Toggle the eye icon (optional, but good UX)
        this.textContent = (type === 'password' ? '👁️' : '🔒'); // Change icon based on type
    });
}
