
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // For serving static files

const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(cors()); // Allow frontend to make requests

// Serve static files (your index.html and index.js should be in a 'public' folder)
app.use(express.static(path.join(__dirname, 'public')));
// If you navigate to http://localhost:3000, it will automatically look for and serve public/index.html

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/StudentInformation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Define a Schema and Model
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    marks: { type: Number, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true }, // Remember to hash passwords in a real application!
    dateAdded: { type: Date, default: Date.now }
});

const Student1 = mongoose.model('Student1', studentSchema);

// API Route to add a new student (POST request)
app.post('/api/students', async (req, res) => {
    try {
        const { name, marks, lastName, password } = req.body;

        if (!name || !marks || !lastName || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const newStudent = new Student1({ name, marks, lastName, password });
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(400).json({ error: error.message });
    }
});



app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});