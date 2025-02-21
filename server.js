const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  

const app = express();

// CORS Configuration
const corsOptions = {
    origin: ['http://localhost:3001', 'https://elias2025.netlify.app'], // Allow frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Import and Use Routes
const blogRoutes = require('./routes/BlogRoutes');
app.use('/api', blogRoutes);

// Default Route for Testing
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
