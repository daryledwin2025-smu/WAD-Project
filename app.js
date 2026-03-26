const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = express();
const PORT = 8000;

// === APP CONFIGURATION ===
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// === SESSION SETUP (use ENV from your friend - better practice) ===
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

// === ROUTE IMPORTS ===
const usersRoutes = require("./routes/users-routes");    // Person 1
const petRoutes = require('./routes/pets-routes');       // Person 2
const browseRoutes = require('./routes/browse-routes');  // Person 3
const applicationRoutes = require('./routes/applications'); // Person 4
const dashboardRoutes = require('./routes/dashboard-routes');      // Person 5
const favouriteRoutes = require('./routes/favourites-routes');     // Person 6

// === MOUNTING ROUTES ===
app.use('/', usersRoutes);
app.use('/pets', petRoutes);
app.use('/browse', browseRoutes);
app.use('/applications', applicationRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/favourites', favouriteRoutes);

// === DATABASE CONNECTION ===
async function connectDB() {
    try {
        await mongoose.connect(process.env.DB);
        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

// === START SERVER ===
async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

startServer();