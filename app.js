const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
// love
// Initialize Express app
const app = express();
const PORT = 8000;

// === APP CONFIGURATION ===
// Set EJS as the templating engine [cite: 13]
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// === SESSION SETUP ===
app.use(session({
    secret: 'is113-secret-key',
    resave: false,
    saveUninitialized: true
}));


// === MOCK SESSION MIDDLEWARE (FOR TESTING ONLY) ===
// This injects a fake user so you don't get redirected to /user-login
app.use((req, res, next) => {
    req.session.user = { 
        _id: new mongoose.Types.ObjectId('64b5f8b9e4b0a1b2c3d4e5f6'),
        username: 'Joshua',
        account: 'Adopter'
    };
    next();
});

// === MIDDLEWARE ===
// To parse form data from the basic HTML forms [cite: 24]
app.use(express.urlencoded({ extended: true }));

// Serve static files (like your index.html or any basic CSS/images)
app.use(express.static(path.join(__dirname, 'public')));

// Create session to remain logged in through all the html pages
app.use(
  session({
    secret: '123',  
    resave: false,
    saveUninitialized: false
  })
);

// === DATABASE CONNECTION ===
// Connecting to a single MongoDB database [cite: 20]
// Replace 'pet_adoption_db' with your actual local or Atlas connection string [cite: 28]
mongoose.connect('mongodb://localhost:27017/pet_adoption_db')
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));
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

// A temporary route to mimic the browse page for testing
const Pet = require('./models/Pet');
app.get('/browse', async (req, res) => {
    const pets = await Pet.find();
    let html = '<h1>Browse Pets</h1><ul>';
    pets.forEach(pet => {
        html += `<li>${pet.name} - <a href="/applications/new/${pet._id}">Apply Here</a></li>`;
    });
    html += '</ul><br><a href="/applications/mine">View My Applications</a>';
    res.send(html);
});

// === DATABASE CONNECTION ===
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
