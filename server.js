
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const emailRouter = require('./emailRoute');
app.use('/email', emailRouter)


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong!' });
});

const port = process.env.PORT || 3001; // Use the PORT environment variable if available
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




