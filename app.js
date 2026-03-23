const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config({path:"./config.env"});

// Initialize Express app
const app = express();

// === APP CONFIGURATION ===
// Set EJS as the templating engine [cite: 13]
app.set('view engine', 'ejs');
// === MIDDLEWARE ===
// To parse form data from the basic HTML forms [cite: 24]
app.use(express.urlencoded({ extended: true }));

// Serve static files (like your index.html or any basic CSS/images)
app.use(express.static(path.join(__dirname, 'public')));

// === DATABASE CONNECTION ===
// Connecting to a single MongoDB database [cite: 20]
// Replace 'pet_adoption_db' with your actual local or Atlas connection string [cite: 28]
// mongoose.connect('mongodb://localhost:27017/pet_adoption_db')
//   .then(() => console.log('Connected to MongoDB successfully!'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// === ROUTE IMPORTS (The Vertical Slices) ===
// Each team member's dedicated routing file 
// const authRoutes = require('./routes/auth');               // Person 1
const petRoutes = require('./routes/pets.js');                // Person 2
// const browseRoutes = require('./routes/browse');           // Person 3
// const applicationRoutes = require('./routes/applications');// Person 4
// const dashboardRoutes = require('./routes/dashboard');     // Person 5
// const favouriteRoutes = require('./routes/favourites');    // Person 6

// === MOUNTING ROUTES ===
// app.use('/', authRoutes);
app.use('/pets', petRoutes);
// app.use('/browse', browseRoutes);
// app.use('/applications', applicationRoutes);
// app.use('/dashboard', dashboardRoutes);
// app.use('/favourites', favouriteRoutes);


// === DATABASE ===
async function connectDB(){
  try{
  await mongoose.connect(process.env.DB); // connect is an async function
  console.log('Database connected successfully!');
  }
  catch(error){
    console.log("Database connection failed",error)
  }
}
connectDB();
// === START SERVER ===
const hostname = "localhost";
const port = 8000;

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
