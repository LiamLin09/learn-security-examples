const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/infodisclosure', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a Mongoose schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Create a Mongoose model based on the schema
const User = mongoose.model('User', userSchema);

// Sample usernames and passwords
const sampleUsers = [
  { username: 'user99', password: 'password1' },
  { username: 'user89', password: 'password2' },
  { username: 'user79', password: 'password3' },
];

// Function to insert sample users into the database
async function insertSampleUsers() {
  try {
    // Insert sample users
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log('Sample users inserted successfully:', insertedUsers);
  } catch (error) {
    console.error('Error inserting sample users:', error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
}

// Call the function to insert sample users
insertSampleUsers();
