const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = express();

// === APP CONFIGURATION ===
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// === SESSION SETUP ===
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

// === ROUTE IMPORTS ===
const usersRoutes = require("./routes/users-routes");    // Person 1
// const petRoutes = require('./routes/pets');              // Person 2
// const browseRoutes = require('./routes/browse');         // Person 3
const applicationRoutes = require('./routes/applications'); // Person 4
// const dashboardRoutes = require('./routes/dashboard');   // Person 5
// const favouriteRoutes = require('./routes/favourites');  // Person 6

// === MOUNTING ROUTES ===
app.use('/', usersRoutes);
// app.use('/pets', petRoutes);
// app.use('/browse', browseRoutes);
app.use('/applications', applicationRoutes);
// app.use('/dashboard', dashboardRoutes);
// app.use('/favourites', favouriteRoutes);

// Temporary browse route (Joshua's testing stub)
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
async function connectDB() {
    try {
        await mongoose.connect(process.env.DB);
        console.log('Database connected successfully!');
    } catch (error) {
        console.log('Database connection failed', error);
    }
}

// === START SERVER ===
function startServer() {
    app.listen(8000, 'localhost', () => {
        console.log('Server running at http://localhost:8000/');
    });
}

connectDB().then(startServer);