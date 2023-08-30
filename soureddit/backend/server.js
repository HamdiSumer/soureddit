// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/post-routes');
const userRoutes = require('./routes/user-routes');
const HttpError = require('./models/http-error');
const cors = require('cors'); // Import the CORS middleware
const { updateUserSelectedItems, updateChance } = require('./controllers/user-controller');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// Create an Express application instance
const app = express();

// Middleware
app.use(bodyParser.json());
const corsOptions ={
  origin:'http://localhost:3000',
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors({corsOptions,
  origin: 'http://localhost:3000', // Replace with your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // This is important to allow sending cookies
 }));

// Routing
app.use('/posts', postRoutes);
app.use('/users', userRoutes);


// Assuming you're using Express.js for your backend
app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const selectedItems = req.query.selectedItems || []; // Default to an empty array if not provided
    const user = await getUserDataFromDatabase(userId, selectedItems); // Pass the selectedItems to your database function
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch usersssssssssssssssssssss.' });
  }
});
app.put('/users/:userId/selectedItems', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { selectedItems } = req.body;

    const updatedUser = await updateUserSelectedItems(userId, selectedItems);
    if (!updatedUser) {
      return res.status(500).json({ message: 'Could not update selected items' });
    }

    res.status(200).json({ message: 'Selected items updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating selected items:', error);
    res.status(500).json({ message: 'Could not update selected items' });
  }
});
app.put('/users/:userId/updateChance', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { updateChance } = req.body;

    const updatedUser = await updateUserSelectedItems(userId, updateChance);
    if (!updatedUser) {
      return res.status(500).json({ message: 'Could not update updateChancessss' });
    }

    res.status(200).json({ message: 'updateChance updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating chance:', error);
    res.status(500).json({ message: 'Could not update chancebbbbbbb' });
  }
});


app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({
    message: error.message || 'An unexpected error occurred !',
  });
});

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Check for successful connection
const db = mongoose.connection;

db.once('open', () => {
  console.log('MongoDB connection is open');
});

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Optionally, you can also listen for SIGINT (Ctrl+C) to gracefully close the connection when the Node.js process is terminated
process.on('SIGINT', () => {
  db.close(() => {
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  });
});
