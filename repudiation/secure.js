const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

let messages = [];
const logStream = fs.createWriteStream('server.log', { flags: 'a' });

// Middleware for parsing URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Middleware for logging requests
app.use((req, res, next) => {
    const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.url} - ${req.ip}`;
    logStream.write(logEntry + '\n');
    next();
});

// Route to send a message (requires authentication)
app.post('/send-message', (req, res) => {
    const { message, user } = req.body;

    if (!message || !user) {
        return res.status(400).json({ error: 'Message and user are required fields.' });
    }

    messages.push({ message, user });

    const logEntry = `[${new Date().toISOString()}] Message sent by ${user}: ${message}`;
    logStream.write(logEntry + '\n');

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
});

// Route to retrieve messages (requires authentication)
app.get('/get-messages', (req, res) => {
    // Implement user authentication mechanism here (e.g., token validation)

    // Simulate user authentication for demonstration purposes
    const isAuthenticated = true; // Placeholder for actual authentication logic

    if (!isAuthenticated) {
        return res.status(401).json({ error: 'Unauthorized access. Please login.' });
    }

    // Log access to messages
    const logEntry = `[${new Date().toISOString()}] Messages retrieved by ${req.ip}`;
    logStream.write(logEntry + '\n');

    return res.status(200).json(messages);
});

// Route to serve the HTML form
app.get('/send-message-form', (req, res) => {
  // Serve the HTML form located in the 'public' directory
  res.sendFile(__dirname + '/sendMessage.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const logEntry = `[${new Date().toISOString()}] Error: ${err.message}`;
    logStream.write(logEntry + '\n');
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
