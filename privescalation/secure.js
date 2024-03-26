const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

// Middleware for parsing URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Simulated database of users with different roles
const users = [
  { id: 1, username: 'admin', role: 'admin' },
  { id: 2, username: 'user1', role: 'user' },
  { id: 3, username: 'user2', role: 'user' }
];

// Route to update user role (WITH SESSION AUTHENTICATION)
app.post('/update-role', (req, res) => {
  const { userId, newRole } = req.body;

  // Check if the user is logged in (authenticated)
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Simulated authorization based on session data
  const loggedInUser = users.find(u => u.id === Number(req.session.userId));
  if (!loggedInUser || loggedInUser.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Update user role
  const userToUpdate = users.find(u => u.id === userId);
  if (!userToUpdate) {
    return res.status(404).json({ error: 'User not found' });
  }

  userToUpdate.role = newRole;
  res.json({ message: 'User role updated successfully' });
});

// Route to serve the HTML form
app.get('/send-form', (req, res) => {
  // Serve the HTML form located in the 'public' directory
  res.sendFile(__dirname + '/userForm.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
