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
        if (shelterId === undefined) {
            return res.redirect("/home");
        } 
        let allPets = await Pet.retrieveAllPetsByShelterId(shelterId); // fetch all the list    
        // console.log(allPets);
        // console.log(`query: ${shelterId}`);
        
        // Darryl's reviews logic
        const Review = require("../models/Review");
        const reviews = await Review.find({ shelter: shelterId })
            .populate("reviewer", "username")
            .sort({ createdAt: -1 })
            .limit(3);
        const avgRating = reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : null;

        res.render("browse", { allPets, reviews, avgRating, shelterId, user: req.session.user });// Render the EJS form view and pass the posts
    } catch (error) {
        console.error(error);
        res.send("Error reading database"); // Send error message if fetching fails
  }
}

exports.displayPetDetail = async (req,res)=>{
    let petId = req.query.petId;    
    console.log(petId);
    let pet = await Pet.displayPetById(petId);
    console.log(pet);
    res.render("pet-detail",{pet});
}

