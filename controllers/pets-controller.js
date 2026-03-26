const Pet = require("../models/pet-model")
const UserModel = require("../models/user-model");

// DISPLAYS
exports.displayMyListings = async (req, res) => {
    let userId = req.session.user._id;

    let query = { shelterId: userId };

    // name filter (exact match)
    if (req.query.name && req.query.name !== "") {
        query.name = req.query.name;
    }

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

    res.render("myListings", { allPets, req });
};

exports.displayAddPet = (req,res)=>{
    res.render("add-pet");
}
// FUNCTIONS
exports.addPet = async (req, res) => {
    let pet = req.body;
    // handle checkboxes
    pet.vaccinated = pet.vaccinated ? true : false;
    pet.neutered = pet.neutered ? true : false;
    pet.houseTrained = pet.houseTrained ? true : false;
    pet.shelterId = req.session.user._id;
    try {
        let result = await Pet.addPet(pet);
        res.redirect('/pets/myListings');
    } catch (error) {
        console.log(error);
    }
};

exports.displayAllPets = async (req,res)=>{
    try {
        const shelterId = req.query.shelterId;
        const shelter = await UserModel.getUserById(shelterId); 
        if (shelterId === undefined) {
            return res.redirect("/home");
        } 
        let query = { shelterId: shelterId };

        // name
        if (req.query.name && req.query.name !== "") {
            query.name = req.query.name;
        }

        // size
        if (req.query.size && req.query.size !== "") {
            query.size = req.query.size;
        }

        // vaccinated
        if (req.query.vaccinated) {
            query.vaccinated = true;
        }

        // neutered
        if (req.query.neutered) {
            query.neutered = true;
        }

        // house trained
        if (req.query.houseTrained) {
            query.houseTrained = true;
        }

        let allPets = await Pet.filterPets(query);        // console.log(allPets);
        // console.log(`query: ${shelterId}`);
        
        // Darryl's reviews logic
        const Review = require("../models/Review");
        const reviews = await Review.find({ shelter: shelterId }) // read from reviews collection, .find comes in the model automatically (find reviews for the specific shelter and create a list)
            .populate("reviewer", "username") // reviewer is an objectId pointing to user collection (based on schema), reviewer becomes object with id and username (from User collection) as its keys
            .sort({ createdAt: -1 }) // sort in descending order of date
            .limit(3); // display first 3 items in list only

        const validReviews = reviews.filter(review => review.reviewer !== null); // keep element if condition is true
        // filter out any reviews whose userID may be deleted 

        let totalRating = 0
        validReviews.forEach(review => {
            totalRating += review.rating
        });
        const avgRating = validReviews.length > 0
            ? (totalRating / validReviews.length).toFixed(1)
            : null;

        res.render("browse", { allPets, reviews: validReviews, avgRating, shelterId, shelter, user: req.session.user,req });// Render the EJS form view and pass the posts
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

exports.displayEditPet = async (req,res)=>{
    let petId = req.query.petId;    
    console.log(petId);
    let pet = await Pet.displayPetById(petId);
    console.log(pet);
    res.render("edit-pet",{pet});
}

exports.editPet = async (req, res) => {
    let pet = req.body;
    // handle checkboxes
    pet.vaccinated = pet.vaccinated ? true : false;
    pet.neutered = pet.neutered ? true : false;
    pet.houseTrained = pet.houseTrained ? true : false;

    try {
        let result = await Pet.editPet(pet);
        res.redirect('/pets/myListings');
    } catch (error) {
        console.log(error);
    }
};

exports.deletePet = async(req,res)=>{
    const petId = req.query.petId;
    try{
        success = await Pet.deletePet(petId);
        if (success.deletedCount===1){
        res.redirect("/pets/myListings");
        console.log('Deleted Pet');
        }
    } catch(error){
        console.log(error);
        res.redirect("/pets/myListings");
    }
}

// exports.deletePetByShelterId = async(req,res)=>{
//     const shelterId = req.session.user._id;
//     await Pet.deletePetsByShelterId(shelterId);
// }