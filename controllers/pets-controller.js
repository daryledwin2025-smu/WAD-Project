const Pet = require("../models/pet-model")
// DISPLAYS
exports.displayMyListings = async (req, res) => {
    let userId = req.session.user._id;
    let query = { shelterId: userId };
    // size filter
    if (req.query.size && req.query.size !== "") {
        query.size = req.query.size;
    }
    // vaccinated filter
    if (req.query.vaccinated) {
        query.vaccinated = true;
    }
    if (req.query.neutered) {
        query.neutered = true;
    }
    if (req.query.houseTrained) {
        query.houseTrained = true;
    }
    let allPets = await Pet.filterPets(query);
    // name filter
    if (req.query.name && req.query.name.trim() !== "") {
        allPets = allPets.filter(pet =>
            pet.name.toLowerCase().includes(req.query.name.trim().toLowerCase())
        );
    }
    // breed filter
    console.log("QUERY:", req.query.breed);
console.log("ALL PETS:", allPets);
    if (req.query.breed && req.query.breed.trim() !== "") {
    allPets = allPets.filter(pet =>
        pet.breed.toLowerCase().includes(req.query.breed.trim().toLowerCase())
    );
}
    res.render("myListings", { allPets, req });
};

exports.displayAddPet = (req, res) => {
    res.render("add-pet");
}
// FUNCTIONS
exports.addPet = async (req,res)=>{
    let pet = req.body;
    pet.shelterId = req.session.user._id;
    try{
        let result = await Pet.addBook(pet);
    }
    catch(error){
        console.log(error);
    }
}

exports.displayAllPets = async (req,res)=>{
      try {
    shelterId = req.query.shelterId;
    let allPets = await Pet.retrieveAllPetsByShelterId(shelterId);// fetch all the list    
    // console.log(allPets);
    // console.log(`query: ${shelterId}`);
    res.render("browse", { allPets }); // Render the EJS form view and pass the posts
  } catch (error) {
    console.error(error);
    res.send("Error reading database"); // Send error message if fetching fails
  }
}