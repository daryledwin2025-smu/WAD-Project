const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    medicalStatus: { type: String, required: true },
    status: { type: String, default: 'Available' } 
});

module.exports = mongoose.model('Pet', petSchema);