const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// love
// Initialize Express app
const app = express();
const PORT = 8000; // As suggested in the brief for local testing [cite: 44]

// === APP CONFIGURATION ===
// Set EJS as the templating engine [cite: 13]
app.set('view engine', 'ejs');
// Point to the views folder 
app.set('views', path.join(__dirname, 'views'));

// === MIDDLEWARE ===
// To parse form data from the basic HTML forms [cite: 24]
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

// Serve static files (like your index.html or any basic CSS/images)
app.use(express.static(path.join(__dirname, 'public')));

// === DATABASE CONNECTION ===
// Connecting to a single MongoDB database [cite: 20]
// Replace 'pet_adoption_db' with your actual local or Atlas connection string [cite: 28]
mongoose.connect('mongodb://localhost:27017/pet_adoption_db')
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// === ROUTE IMPORTS (The Vertical Slices) ===
// Each team member's dedicated routing file 
const authRoutes = require('./routes/auth');               // Person 1
const petRoutes = require('./routes/pets');                // Person 2
const browseRoutes = require('./routes/browse');           // Person 3
const applicationRoutes = require('./routes/applications');// Person 4
const dashboardRoutes = require('./routes/dashboard');     // Person 5
const favouriteRoutes = require('./routes/favourites');    // Person 6 (Optional)

// === MOUNTING ROUTES ===
app.use('/', authRoutes);
app.use('/pets', petRoutes);
app.use('/browse', browseRoutes);
app.use('/applications', applicationRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/favourites', favouriteRoutes);

// === START SERVER ===

