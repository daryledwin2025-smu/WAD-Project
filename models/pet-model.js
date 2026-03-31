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
        type: String
    },
    vaccinated: {
        type: Boolean
    },
    neutered: {
        type: Boolean
    },
    houseTrained: {
        type: Boolean
    },

    createdAt: { 
        type: Date, 
        default: Date.now 
    }
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

exports.editPet = (pet) => {
    return Pet.updateOne(
        { _id: pet._id },
        {
            name: pet.name,
            breed: pet.breed,
            age: pet.age,
            size: pet.size,
            description: pet.description,
            vaccinated: pet.vaccinated,
            neutered: pet.neutered,
            houseTrained: pet.houseTrained
        }
    );
};
exports.filterPets = (query) => {
    return Pet.find(query);
};
exports.deletePet = (petId)=>{
    return Pet.deleteOne({_id:petId})
}

exports.deletePetsByShelterId = (shelterId)=>{
    return Pet.deleteMany({shelterId});
}

exports.getBreedsByShelter = async function (shelterId) {
    let pets = await Pet.find({ shelterId: shelterId });

    let breeds = [];

    for (let i = 0; i < pets.length; i++) {
        let breed = pets[i].breed;

        // avoid duplicates
        if (!breeds.includes(breed)) {
            breeds.push(breed);
        }
    }

    return breeds;
};