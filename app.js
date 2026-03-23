const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
// love
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

// Create session to remain logged in through all the html pages
app.use(
  session({
    secret: process.env.SECRET,  
    resave: false,
    saveUninitialized: false
  })
);

// === DATABASE CONNECTION ===
// Connecting to a single MongoDB database [cite: 20]
// Replace 'pet_adoption_db' with your actual local or Atlas connection string [cite: 28]
// mongoose.connect(process.env.DB)
//   .then(() => console.log('Connected to MongoDB successfully!'))
//   .catch((err) => console.error('MongoDB connection error:', err));
async function connectDB() {
    try {
        await mongoose.connect(process.env.DB);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

// === ROUTE IMPORTS (The Vertical Slices) ===
// Each team member's dedicated routing file 
<<<<<<< HEAD
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
=======
const usersRoutes = require("./routes/users-routes")       // Person 1
const petRoutes = require('./routes/pets');                // Person 2
const browseRoutes = require('./routes/browse');           // Person 3
const applicationRoutes = require('./routes/applications');// Person 4
const dashboardRoutes = require('./routes/dashboard');     // Person 5
const favouriteRoutes = require('./routes/favourites');    // Person 6 (Optional)

// === MOUNTING ROUTES ===
app.use('/', usersRoutes);
app.use('/pets', petRoutes);
app.use('/browse', browseRoutes);
app.use('/applications', applicationRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/favourites', favouriteRoutes);
>>>>>>> 9b9944ac98e4317c2c8ceaf1165f6af601dea7c6


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
function startServer() {
    const hostname = "localhost";
    const port = 8000;

    app.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

connectDB().then(startServer);
