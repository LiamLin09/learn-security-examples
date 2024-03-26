const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

let messages = [];

// Middleware for parsing URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Route to send a message
app.post('/send-message', (req, res) => {
    console.log(req.body);
    const { message, user } = req.body;

    if (!message || !user) {
        return res.status(400).json({ error: 'Message and user are required fields.' });
    }

    messages.push({ message, user });

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
});

// Route to retrieve messages (without authentication)
app.get('/get-messages', (req, res) => {
    return res.status(200).json(messages);
});

// Route to serve the HTML form
app.get('/send-message-form', (req, res) => {
  // Serve the HTML form located in the 'public' directory
  res.sendFile(__dirname + '/sendMessage.html');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
