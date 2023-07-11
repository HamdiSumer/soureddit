// Dependencies

const express = require("express");

// Create Applications
const app = express()

// Routing

app.get("/", (req, res) => {
    res.json({hello:"world2"});
});

app.get("/test", (req, res) => {
    res.json({hello:"world2"});
});

// Start our server
app.listen(3001);