// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/post-routes');
const userRoutes = require('./routes/user-routes');
const HttpError = require('./models/http-error');
const cors = require('cors'); // Import the CORS middleware

// Create an Express application instance
const app = express();

// Middleware
app.use(bodyParser.json());
// app.use(cors({ origin: 'http://localhost:3000/' }));

const corsOptions ={
    origin:'http://localhost:3000',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));


// Handle preflight requests explicitly
app.options('*', cors());

// Routing
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

// error handler
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route !', 404);
  throw error; // Pass the error to the next middleware
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
