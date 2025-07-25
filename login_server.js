import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { appendFile, readFile } from "fs/promises"; // Import appendFile from fs/promises

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Serve static files from the 'project2' directory (your frontend)
app.use(express.static(path.join(__dirname, 'project2')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/logForm', { // Changed database name slightly to avoid confusion
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("Could not connect to MongoDB", err));

// Mongoose Schema and Model
const logFormSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Password: { type: String, required: true },
    timestamp: { type: Date, default: Date.now } // Added timestamp for logs
});

const LogForm = mongoose.model('LogForm', logFormSchema); // Model names are typically singular (LogForm)

const infoFilePath = path.join(__dirname, 'info.txt');

// API to handle POST requests for creating a new log entry
app.post('/api/logForm', async (req, res) => {
    try {
        const { name, password, additionalInfo } = req.body; // Added optional 'additionalInfo' for text file

        if (!name || !password) {
            return res.status(400).json({ error: "Name and Password are required" });
        }

        // 1. Save to MongoDB
        const newLogEntry = new LogForm({ Name: name, Password: password });
        await newLogEntry.save();
        console.log("MongoDB entry saved:", newLogEntry);

        // 2. Append to text file (if additionalInfo is provided)
        if (additionalInfo) {
            const logMessage = `Name: ${name}, Password: ${password}, Info: ${additionalInfo}, Timestamp: ${new Date().toISOString()}\n`;
            await appendFile(infoFilePath, logMessage, 'utf8');
            console.log("Info appended to file.");
        }

        // Send a single, consolidated success response
        res.status(201).json({
            message: 'Log details saved and info updated successfully!',
            mongoEntry: newLogEntry // Optionally return the saved MongoDB entry
        });

    } catch (error) {
        console.error("Error in /api/logForm:", error);
        res.status(500).json({ error: error.message || "An unexpected error occurred." });
    }
});

// API to handle GET requests for the content of info.txt
// This should be a distinct API endpoint, not the root path, if you also serve static files from root.
app.get('/api/info-content', async (req, res) => {
    try {
        const fileContent = await readFile(infoFilePath, 'utf8');
        res.json({ content: fileContent });
    } catch (error) {
        // If the file doesn't exist, readFile will throw an error.
        // You might want to handle this specifically (e.g., send empty content or a 404)
        if (error.code === 'ENOENT') { // 'ENOENT' means 'Error No ENTity' (file or directory not found)
            return res.status(404).json({ error: 'info.txt not found' });
        }
        console.error('Error reading info.txt for /api/info-content route:', error);
        res.status(500).json({ error: 'Failed to read file content.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Back-End server running on http://localhost:${port}`);
    console.log(`Frontend served from http://localhost:${port}/`); // Frontend served from here
    console.log(`API for saving logs: http://localhost:${port}/api/logForm (POST)`);
    console.log(`API for info.txt content: http://localhost:${port}/api/info-content (GET)`);
});
