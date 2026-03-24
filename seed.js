const mongoose = require('mongoose');
const Pet = require('./models/Pet');
const Application = require('./models/Application');

// Connect to your local MongoDB database
mongoose.connect('mongodb://localhost:27017/pet_adoption_db')
    .then(() => console.log('Connected to MongoDB for seeding...'))
    .catch(err => console.error('Connection error:', err));

const seedDB = async () => {
    try {
        // 1. Clear out old data to prevent duplicates during testing
        await Pet.deleteMany({});
        await Application.deleteMany({});
        console.log('Cleared existing pets and applications.');

        // 2. Create dummy pets
        const pets = [
            {
                name: "Bella",
                species: "Dog",
                breed: "Golden Retriever",
                age: 3,
                medicalStatus: "Vaccinated, Spayed",
                status: "Available"
            },
            {
                name: "Luna",
                species: "Cat",
                breed: "British Shorthair",
                age: 1,
                medicalStatus: "Vaccinated",
                status: "Available"
            },
            {
                name: "Max",
                species: "Dog",
                breed: "Beagle Mix",
                age: 5,
                medicalStatus: "Requires daily joint supplement",
                status: "Available"
            }
        ];

        // 3. Insert the pets into the database
        await Pet.insertMany(pets);
        console.log('Successfully seeded 3 pets!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the connection so the terminal process terminates gracefully
        mongoose.connection.close();
        console.log('Database connection closed.');
    }
};

// Execute the function
seedDB();