document.addEventListener("DOMContentLoaded", function () {
    let nextPageToken = '';

    // Fetch videos from YouTube API
    async function fetchVideos(pageToken = '') {
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=education&type=video&maxResults=10&pageToken=${pageToken}&key=xxx`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            console.log("Next Page Token:", data.nextPageToken); // Debugging

            displayVideos(data.items); // Pass only video items

            nextPageToken = data.nextPageToken || ''; // Save next page token
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    }

    // Display videos without overlap
    function displayVideos(videos) {
        const container = document.getElementById("video-container");

        videos.forEach((video) => {
            const videoId = video.id.videoId;
            const title = video.snippet.title;

            // Create a video card with an embedded iframe
            const videoElement = document.createElement("div");
            videoElement.classList.add("video-card");

            videoElement.innerHTML = `
                <iframe width="320" height="180" src="https://www.youtube.com/embed/${videoId}" 
                    frameborder="0" allowfullscreen></iframe>
                <p>${title}</p>
            `;

            container.appendChild(videoElement);
        });
    }

    // Load more videos when clicking the button
    document.getElementById("loadMore").addEventListener("click", () => {
        if (nextPageToken) {
            fetchVideos(nextPageToken);
        } else {
            console.log("No more pages available.");
        }
    });

    // Load videos on page load
    fetchVideos();

    // ===== AI CHATBOT FUNCTIONALITY =====
    const chatToggle = document.getElementById("chatbot-toggle");
    const chatbox = document.getElementById("chatbox");
    const sendBtn = document.getElementById("send-btn");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

    // Toggle chatbot visibility
    chatToggle.addEventListener("click", () => {
        chatbox.classList.toggle("hidden");
    });

    // Send Message to OpenAI API
    sendBtn.addEventListener("click", async () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        // Display user message
        chatMessages.innerHTML += `<div class="message user"><strong>You:</strong> ${userMessage}</div>`;
        chatInput.value = "";
        sendBtn.disabled = true; // Disable send button while waiting

        // Show typing indicator
        chatMessages.innerHTML += `<div id="typingIndicator" class="message bot">Bot is typing...</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const aiResponse = await fetchChatGPTResponse(userMessage);
            document.getElementById("typingIndicator").remove(); // Remove typing indicator
            chatMessages.innerHTML += `<div class="message bot"><strong>Bot:</strong> ${aiResponse}</div>`;
        } catch (error) {
            document.getElementById("typingIndicator").remove();
            chatMessages.innerHTML += `<div class="message error"><strong>Bot:</strong> Error fetching response. Try again.</div>`;
        }

        sendBtn.disabled = false; // Re-enable send button
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    // Fetch AI response from OpenAI API
    async function fetchChatGPTResponse(message) {
        const API_KEY = "xxxx"; // Replace with your actual API key
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }]
            })
        });

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }
});

