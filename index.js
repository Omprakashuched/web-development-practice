
const formContainer = document.getElementById('Form');

if (formContainer) {

    formContainer.innerHTML = `
        <div class="bg-white p-8 rounded-lg shadow-xl w-full border border-gray-200">
            <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Student Information</h2>

            <input
                type="text"
                name="userName"
                id="userNameInput"
                placeholder="Name"
                class="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />

            <input
                type="number"
                name="userMarks"
                id="userMarksInput"
                placeholder="Marks"
                class="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />

            <div class="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    name="lastName"
                    id="lastNameInput"
                    required
                    placeholder="Last Name"
                    class="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />

                <input
                    type="password"
                    name="userPassword"
                    id="userPasswordInput"
                    required
                    placeholder="Password"
                    class="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
            </div>

            <div class="text-center">
                <button
                    id="submitButton"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Submit
                </button>
            </div>
        </div>
    `;

    // --- Now that the HTML is in the DOM, you can select elements and add event listeners ---

    const submitButton = document.getElementById('submitButton');
    const userNameInput = document.getElementById('userNameInput');
    const userMarksInput = document.getElementById('userMarksInput');
    const lastNameInput = document.getElementById('lastNameInput');
    const userPasswordInput = document.getElementById('userPasswordInput');

    // Example function for the submit button
    async function handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission behavior

        const name = userNameInput.value;
        const marks = userMarksInput.value;
        const lastName = lastNameInput.value;
        const password = userPasswordInput.value;

        try {
            // Send data to your backend API
            const response = await fetch('http://localhost:3000/api/students', { // Your backend API URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, marks, lastName, password }),
            });

            if (response.ok) {
                // const data = await response.json();

                userNameInput.value = '';
                userMarksInput.value = '';
                lastNameInput.value = '';
                userPasswordInput.value = '';
            } else {
                const errorData = await response.json(); // Try to parse error message from backend
                console.error('Failed to add student:', response.status, errorData);
                alert(`Error submitting student data: ${errorData.error || response.statusText}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    }

    // Attach the event listener to the submit button
    if (submitButton) {
        submitButton.addEventListener('click', handleSubmit);
    }

    // You can also add event listeners to input fields if needed for other purposes (e.g., real-time validation)
    if (userNameInput) {
        userNameInput.addEventListener('input', () => {
            console.log('Name input changed:', userNameInput.value);
            // Add validation logic here
        });
    }

} else {
    console.error("The element with ID 'Form' was not found in the DOM.");
}