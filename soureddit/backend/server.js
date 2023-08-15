// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/post-routes');
const userRoutes = require('./routes/user-routes');
const HttpError = require('./models/http-error');
const cors = require('cors'); // Import the CORS middleware
const { updateUserSelectedItems } = require('./controllers/user-controller');

// Create an Express application instance
const app = express();

// Middleware
app.use(bodyParser.json());
const corsOptions ={
  origin:'http://localhost:3000',
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));

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

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({
    message: error.message || 'An unexpected error occurred !',
  });
});

// Start our server
mongoose
  .connect('mongodb+srv://dev:1234@cluster0.d0urco0.mongodb.net/soureddit?retryWrites=true&w=majority')
  .then(() => {
    app.listen(3001, () => {
      console.log('Server is running on http://localhost:3001');
    });
  })
  .catch((err) => {
    console.log(err);
  });
