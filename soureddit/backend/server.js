// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/post-routes');

// Create an Express application instance
const app = express();

// Middleware
app.use(bodyParser.json());

// Routing
app.use('/api/posts', postRoutes);

// Start our server
app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
