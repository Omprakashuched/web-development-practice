import http from 'http';
import mongoose from "mongoose";
// CORS is handled manually in this raw HTTP server, so the 'cors' package is not needed.
// import cors from "cors"; 
import { fileURLToPath } from 'url';
import path from "path";
// Removed appendFile, readFile as they are not used in this snippet
// import { appendFile, readFile } from "fs/promises"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use process.env.PORT for deployment, fallback to 3000 for local development
const port =  3000; 

// MongoDB Connection
// Use an environment variable for the MongoDB URI for security and deployment flexibility.
// You MUST set MONGO_URI in your Render service's environment variables.
const MONGO_URI = 'mongodb+srv://omprakashuched:Omkar@123@opu-cluster0.xawhjhq.mongodb.net/?retryWrites=true&w=majority&appName=opu-Cluster0'; 

if (!MONGO_URI) {
    console.error("MONGO_URI environment variable is not set. Please set it for MongoDB connection.");
    // In a production app, you might want to gracefully exit or prevent server start here.
    process.exit(1); 
}

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

// Create the HTTP server
const server = http.createServer(async (req, res) => {
    // Manually set CORS headers
    const allowedOrigins = [
        'http://localhost:5500', 
        'http://127.0.0.1:5500', 
        'http://localhost:3000', 
        'http://127.0.0.1:3000', 
        'https://opu-webapps.netlify.app', // Your Netlify frontend URL (if still in use)
        'https://opu-webs.onrender.com' // Example: Your Render frontend URL. UPDATE THIS!
        // Add any other specific deployed frontend URLs here
    ];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests (OPTIONS method)
    if (req.method === 'OPTIONS') {
        res.writeHead(204); // No Content
        res.end();
        return;
    }

    // API to handle POST requests for creating a new log entry
    if (req.method === 'POST' && req.url === '/api/logForm') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });

        req.on('end', async () => {
            try {
                const { name, password } = JSON.parse(body);

                if (!name || !password) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Name and Password are required" }));
                    return;
                }

                const newLogEntry = new LogForm2({ Name: name, Password: password });
                await newLogEntry.save();
                console.log("MongoDB entry saved:", newLogEntry);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Log details saved and info updated successfully!',
                    mongoEntry: newLogEntry
                }));

            } catch (error) {
                console.error("Error in POST /api/logForm:", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message || "An unexpected error occurred." }));
            }
        });
    } else {
        // Handle 404 for other routes
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

// Start the server
server.listen(port, () => {
    console.log(`Back-End server running on http://localhost:${port}`);
});
