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
// (keep YOUR routes structure)
const usersRoutes = require("./routes/users-routes");
const petRoutes = require('./routes/pets-routes');
const browseRoutes = require('./routes/browse-routes');
// const applicationRoutes = require('./routes/applications');

// === MOUNTING ROUTES ===
app.use('/', usersRoutes);
app.use('/pets', petRoutes);
app.use('/browse', browseRoutes);
// app.use('/applications', applicationRoutes);

// ❌ REMOVED friend's temporary /browse route
// because it conflicts with browseRoutes

// === DATABASE CONNECTION (keep your cleaner async/await version) ===
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