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

// === SESSION SETUP ===
app.use(session({
    secret: 'is113-secret-key',
    resave: false,
    saveUninitialized: true
}));

// === MOCK SESSION (optional for testing) ===
app.use((req, res, next) => {
    req.session.user = { 
        _id: new mongoose.Types.ObjectId(),
        username: 'Joshua',
        account: 'Adopter'
    };
    next();
});

// === STATIC FILES ===
app.use(express.static(path.join(__dirname, 'public')));

// === ROUTES ===
const usersRoutes = require("./routes/users-routes");
const petRoutes = require('./routes/pets-routes');
const browseRoutes = require('./routes/browse-routes');
// const applicationRoutes = require('./routes/applications');

app.use('/', usersRoutes);
app.use('/pets', petRoutes);
app.use('/browse', browseRoutes);
// app.use('/applications', applicationRoutes);

// === DATABASE CONNECTION ===
async function connectDB() {
    try {
        await mongoose.connect(process.env.DB);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
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