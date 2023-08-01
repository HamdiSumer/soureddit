// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import BaseTemplate from "./components/Base/Base";

ReactDOM.render(
  <Router>
      <BaseTemplate/>
  </Router>,
  document.getElementById('root')
);
