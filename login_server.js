import mongoose from "mongoose";
import express from "express";
import cors from "cors"; // Ensure this is imported
import path from "path";
import { fileURLToPath } from 'url';
import { appendFile, readFile } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// *** CHANGE THIS CORS CONFIGURATION ***
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000', 'http://127.0.0.1:3000', 'https://opu-webapps.netlify.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// ************************************

// Serve static files from the 'project2' directory (your frontend)
app.use(express.static(path.join(__dirname, 'project2')));

// MongoDB Connection
const MONGO_URI= 'mongodb://localhost:27017/logForm'
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("Could not connect to MongoDB", err));

// Mongoose Schema and Model
const logFormSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Password: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const LogForm2 = mongoose.model('LogForm2', logFormSchema);

// API to handle POST requests for creating a new log entry
app.post('/api/logForm', async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({ error: "Name and Password are required" });
        }

        const newLogEntry = new LogForm2({ Name: name, Password: password });
        await newLogEntry.save();
        console.log("MongoDB entry saved:", newLogEntry);

        res.status(201).json({
            message: 'Log details saved and info updated successfully!',
            mongoEntry: newLogEntry
        });

    } catch (error) {
        console.error("Error in post method", error);
        res.status(500).json({ error: error.message || "An unexpected error occurred." });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Back-End server running on http://localhost:${port}`);
});
