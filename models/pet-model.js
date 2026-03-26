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
    shelterId: {
        type: String,
        required: true
    },
    size: {
    type: String,
    required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now }
});

const Pet = mongoose.model('Pet', petSchema, 'pets');

exports.addPet = (newPet)=>{
    return Pet.create(newPet);
}

exports.retrieveAllPets = ()=>{
  return Pet.find();
};

exports.retrieveAllPetsByShelterId  = (shelterId)=> {
    return Pet.find({shelterId});
};

exports.displayPetById = (petId)=>{
    return Pet.findOne({_id:petId})
}

exports.editPet = (pet)=>{
    return Pet.updateOne(
  { _id: pet._id },
  {
    name: pet.name,
    breed: pet.breed,
    age: pet.age,
    description: pet.description,
    size:pet.size
  }
);
}

exports.deletePet = (petId)=>{
    return Pet.deleteOne({_id:petId})
}

exports.deletePetsByShelterId = (shelterId)=>{
    return Pet.deleteMany({shelterId});
}