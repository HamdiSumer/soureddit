// Dependencies

const express = require("express");

// Create Applications
const app = express()

// Routing

app.get("/", (req, res) => {
    res.json({hello:"hamdi13"});
});

// Start our server
app.listen(3001);