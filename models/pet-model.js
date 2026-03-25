const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    shelterUsername: {
        type: String,
        required: true
    }
});

const Pet = mongoose.model('Pet', petSchema, 'pets');

exports.addBook = (newPet)=>{
    return Pet.create(newPet);
}

exports.retrieveAllPets = ()=>{
  return Pet.find();
};

exports.retrieveAllPetsByShelterUsername = (username)=> {
  return Pet.find({ shelterUsername: username });
};