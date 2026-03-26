const Pet = require("../models/pet-model")
const UserModel = require("../models/user-model");
const Favourite = require("../models/favourite-model");

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
    if (req.query.name && req.query.name.trim() !== "") {
        allPets = allPets.filter(pet =>
            pet.name.toLowerCase().includes(req.query.name.trim().toLowerCase())
        );
    }
    res.render("myListings", { allPets, req });
};

exports.displayAddPet = (req, res) => {
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

exports.displayAllPets = async (req, res) => {
    try {
        const shelterId = req.query.shelterId;
        const shelter = await UserModel.getUserById(shelterId);
        if (shelterId === undefined) {
            return res.redirect("/home");
        }
        let query = { shelterId: shelterId };

        // name
        // if (req.query.name && req.query.name !== "") {
        //     query.name = req.query.name;
        // }

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
        // name filter in JavaScript only
        if (req.query.name && req.query.name.trim() !== "") {
            allPets = allPets.filter(pet =>
                pet.name.toLowerCase().includes(req.query.name.trim().toLowerCase())
            );
        }
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

        let favouritedPetIds = [];
        if (req.session.user && req.session.user.account !== "Shelter") {
            const userFavs = await Favourite.getFavouritesByUserId(req.session.user._id);
            favouritedPetIds = userFavs.filter(f => f.petId !== null).map(f => f.petId._id.toString());
        }

        res.render("browse", { allPets, reviews: validReviews, avgRating, shelterId, shelter, user: req.session.user, req, favouritedPetIds });
    } catch (error) {
        console.error(error);
        res.send("Error reading database"); // Send error message if fetching fails
    }
}

exports.displayPetDetail = async (req, res) => {
    let petId = req.query.petId;
    console.log(petId);
    let pet = await Pet.displayPetById(petId);
    console.log(pet);
    res.render("pet-detail", { pet, user: req.session.user });
}

exports.displayEditPet = async (req, res) => {
    let petId = req.query.petId;
    console.log(petId);
    let pet = await Pet.displayPetById(petId);
    console.log(pet);
    res.render("edit-pet", { pet });
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

exports.deletePet = async (req, res) => {
    const petId = req.query.petId;
    try {
        success = await Pet.deletePet(petId);
        if (success.deletedCount === 1) {
            res.redirect("/pets/myListings");
            console.log('Deleted Pet');
        }
    } catch (error) {
        console.log(error);
        res.redirect("/pets/myListings");
    }
}

// exports.deletePetByShelterId = async(req,res)=>{
//     const shelterId = req.session.user._id;
//     await Pet.deletePetsByShelterId(shelterId);
// }