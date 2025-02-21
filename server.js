 // Import required dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware Setup
app.use(cors({ origin: '*' })); // Allows all origins for CORS
app.use(express.json()); // Enables JSON request body parsing

// Connect to MongoDB with async/await for better error handling
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1); // Exit the process with an error
    }
};
connectDB();

// Import and Use Routes
const blogRoutes = require('./routes/BlogRoutes'); // Import blog routes
app.use('/api', blogRoutes); // Use routes under the "/api" prefix

// Default Route (Prevents "Cannot GET /" issue)
app.get('/', (req, res) => {
    res.send('✅ API is running successfully! 🚀');
});

// Define Port and Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
