 // Import required dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // Load environment variables from .env file

const app = express();

// Middleware Setup
app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS) for frontend-backend communication
app.use(express.json()); // Allows the server to accept JSON data in requests

// Connect to MongoDB (Remove deprecated options)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Import and Use Routes
const blogRoutes = require('./routes/BlogRoutes'); // Import the blog routes file
app.use('/api', blogRoutes); // Use routes under the "/api" prefix
 

// Define Port and Start Server
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
