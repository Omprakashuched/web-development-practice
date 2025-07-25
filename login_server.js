import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import path from "path"; // Import the 'path' module
import { fileURLToPath } from 'url'; // Import fileURLToPath for __dirname in ES modules
import { readFile } from "fs/promises";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname,'project2')));

mongoose.connect('mongodb://localhost:27017/logForm', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("Could not connect to MongoDB", err)); // Corrected catch block for promise

const logFormSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Password: { type: String, required: true },
});

const LogForm1 = mongoose.model('LogForm1', logFormSchema); // Changed model name to 'LogForm' (capitalized and singular)


app.post('/api/logForm', async (req, res) => { // Added async keyword for await
    try {
        const { name, password } = req.body; // Ensure these match the frontend field names (case-sensitive)

        if (!name || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newLogForm = new LogForm1({ Name: name, Password: password }); // Correctly instantiate model with an object
        await newLogForm.save();
        res.status(201).json(newLogForm);

        const addData = req.body.addData;
        await fs.appendFile(infoFilePath, addData, 'utf8');
        res.status(200).json({ message: 'Already started our journey' });


    } catch (error) {
        console.error("Error creating log details:", error); // Changed message for clarity
        res.status(500).json({ error: error.message }); // Changed status to 500 for server errors
    }
});


const infoFilePath = path.join(__dirname, 'info.txt');

// API to handle GET requests for the root path (/)
// This will read info.txt and send its content
app.get('/', async (req, res) => {
    try {
        // Asynchronously read the content of info.txt with 'utf8' encoding
        const fileContent = await readFile(infoFilePath, 'utf8');

        // Send the file content as a JSON response under a 'content' key
        res.json({ content: fileContent });
    } catch (error) {
        console.error('Error reading info.txt for / route:', error);
    }
});



app.listen(port, () => {
    console.log(`Back-End server running on http://localhost:${port}`);
});
// export { port };