// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/post-routes');
const userRoutes =require('./routes/user-routes');
const HttpError= require('./models/http-error');
const mongoose=require('mongoose');
const { check } = require('express-validator');

// Create an Express application instance
const app = express();

// Middleware
app.use(bodyParser.json());

// Routing
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

// error handler
app.use((req, res, next)=>{
  const error=new HttpError('Could not find this route !',404);
  throw error;
});


app.use((error, req, res, next)=>{
  if(res.headerSent){
    return next(error);
  }
  res.status(error.code || 500 );
  res.json({message: error.message||
    'An unexpected error occured !'});
});

// Start our server
mongoose
  .connect('mongodb+srv://dev:1234@cluster0.d0urco0.mongodb.net/posts?retryWrites=true&w=majority')
  .then(()=>{
    app.listen(3001, () => {
      console.log('Server is running on http://localhost:3001');
    });
  })
  .catch(err=>{
    console.log(err);
  });

