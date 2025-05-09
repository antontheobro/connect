// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { sendToTelegram } = require('./api/send-to-telegram');  // Import the sendToTelegram function

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define the POST route for /api/send-to-telegram
app.post('/api/send-to-telegram', async (req, res) => {
    const formData = req.body;  // Get the form data from the request body
    
    try {
        // Send the form data to Telegram
        await sendToTelegram(formData);
        res.status(200).send('Message sent to Telegram successfully');
    } catch (error) {
        res.status(500).send('Error sending message to Telegram');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});