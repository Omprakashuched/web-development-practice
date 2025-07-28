import http from 'http';
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import path from "path";
import 'dotenv/config'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000; 

const MONGO_URI = process.env.MONGO_URI; 

if (!MONGO_URI) {
    console.error("CRITICAL ERROR: MONGO_URI environment variable is not set. Please set it in .env (local) or Render (deployment).");
    process.exit(1); 
}

mongoose.connect(MONGO_URI) 
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("Could not connect to MongoDB:", err)); 

const logFormSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Password: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const LogForm2 = mongoose.model('LogForm2', logFormSchema);

const server = http.createServer(async (req, res) => {
    
    const allowedOrigins = [
        'http://localhost:5500', 
        'http://127.0.0.1:5500', 
        'http://localhost:3000', 
        'http://127.0.0.1:3000', 
        'https://opu-webs.onrender.com', 
        'https://opu-webapps.netlify.app' // Ensure your Netlify frontend URL is here
    ];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204); 
        res.end();
        return;
    }

    // --- ADDED DETAILED LOGGING HERE ---
    console.log(`Incoming Request: Method=${req.method}, URL=${req.url}`);
    const cleanUrl = req.url.split('?')[0].replace(/\/+$/, ''); 
    console.log(`Cleaned URL: ${cleanUrl}`);

    if (req.method === 'POST' && cleanUrl === '/api/logForm') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); 
        });

        req.on('end', async () => {
            try {
                let parsedBody;
                try {
                    parsedBody = JSON.parse(body);
                } catch (jsonError) {
                    console.error("JSON parsing error:", jsonError); // Log JSON error
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Invalid JSON in request body." }));
                    return;
                }

                const { name, password } = parsedBody;

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
        res.end(JSON.stringify({ error: `Not Found: Method=${req.method}, Path=${req.url}` })); // More specific 404
    }
});

server.listen(port, () => {
    console.log(`Back-End server running on http://localhost:${port}`);
    console.log(`Server listening on port ${port}`); 
});
