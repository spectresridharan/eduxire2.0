const express = require("express");
const axios = require("axios");
require("dotenv").config();  // Load environment variables

const app = express(); // Initialize Express app
const PORT = 5000;
console.log("Fetching YouTube data...");

// Define the API route
app.get("/api/videos", async (req, res) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                key: process.env.YOUTUBE_API_KEY, // Using the key from .env
                part: "snippet",
                q: "education",  // Example search query
                maxResults: 10,
                type: "video"
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("YouTube API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
