const Pet = require("../models/pet-model")
// DISPLAYS
exports.displayMyListings = (req, res) => {
    res.render("myListings", {});
}

exports.displayAddPet = (req,res)=>{
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