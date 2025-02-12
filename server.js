const express = require('express');
const app = express();

// Set up a simple route
app.get('/', (req, res) => {
    res.send('Hello, World! Welcome to my PaaS Web App.');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
