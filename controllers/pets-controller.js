const Pet = require("../models/pet-model");
const UserModel = require("../models/user-model");
const Favourite = require("../models/favourite-model");
const View = require("../models/view-model");

// DISPLAYS
exports.displayMyListings = async (req, res) => {
    let userId = req.session.user._id;
    let query = { shelterId: userId };
    let breeds = await Pet.getBreedsByShelter(userId);
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
    // AGE FILTER
    if (req.query.ageGroup === "young") {
        query.age = { $lte: 2 };
    }

    if (req.query.ageGroup === "adult") {
        query.age = { $gte: 3, $lte: 7 };
    }

    if (req.query.ageGroup === "senior") {
        query.age = { $gte: 8 };
    }
    let allPets = await Pet.filterPets(query);
    // VIEWS
    let allViews = await View.retrieveAll();
    for (let i = 0; i < allPets.length; i++) {
    let count = 0;

    for (let j = 0; j < allViews.length; j++) {
        if (allViews[j].petId.toString() === allPets[i]._id.toString()) {
            count++;
        }
    }

    allPets[i].viewCount = count;
}

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

// views sort
if (req.query.sort === "views") {
    allPets.sort((a, b) => b.viewCount - a.viewCount);
}
    res.render("myListings", { allPets, req, breeds });
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
        let breeds = await Pet.getBreedsByShelter(shelterId);
        if (shelterId === undefined) {
            return res.redirect("/home");
        }
        let query = { shelterId: shelterId };

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
        // AGE FILTER
        if (req.query.ageGroup === "young") {
            query.age = { $lte: 2 };
        }

        if (req.query.ageGroup === "adult") {
            query.age = { $gte: 3, $lte: 7 };
        }

        if (req.query.ageGroup === "senior") {
            query.age = { $gte: 8 };
        }
        let allPets = await Pet.filterPets(query);        // console.log(allPets);
        //VIEWS
        const View = require("../models/view-model"); // adjust name if needed
        let allViews = await View.retrieveAll();
        // name filter in JavaScript only
        if (req.query.name && req.query.name.trim() !== "") {
            allPets = allPets.filter(pet =>
                pet.name.toLowerCase().includes(req.query.name.trim().toLowerCase())
            );
        }
        // BREED filter
        if (req.query.breed && req.query.breed.trim() !== "") {
    allPets = allPets.filter(pet =>
        pet.breed.toLowerCase().includes(req.query.breed.trim().toLowerCase())
    );
}

        // VIEWS LOOP
        for (let i = 0; i < allPets.length; i++) {
            let count = 0;

            for (let j = 0; j < allViews.length; j++) {
                if (allViews[j].petId.toString() === allPets[i]._id.toString()) {
                    count++;
                }
            }
            allPets[i].viewCount = count; // attach to each pet
}
if (req.query.sort === "views") {
    allPets.sort((a, b) => b.viewCount - a.viewCount);
}
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

        res.render("browse", { allPets, reviews: validReviews, avgRating, shelterId, shelter, user: req.session.user, req, favouritedPetIds, breeds });
    } catch (error) {
        console.error(error);
        res.send("Error reading database"); // Send error message if fetching fails
    }
}

exports.displayPetDetail = async (req, res) => {
    let petId = req.query.petId;
    let pet = await Pet.displayPetById(petId);
    // CREATE VIEW RECORD
    await View.addView({
        petId: petId,
        userId: req.session.user ? req.session.user._id : null
    });

    let viewCount = await View.countByPetId(petId);
    res.render("pet-detail", { pet, user: req.session.user });
}

exports.displayEditPet = async (req, res) => {
    let petId = req.query.petId;

    let views = await View.retrieveAll();
    let users = await UserModel.getAllUsers();

    let viewers = [];

    for (let i = 0; i < views.length; i++) {

        // only check views for this pet
        if (views[i].petId.toString() === petId.toString()) {

            for (let j = 0; j < users.length; j++) {

                if (users[j]._id.toString() === views[i].userId) {

                    if (!viewers.includes(users[j].username)) {
                        viewers.push({
                            username: users[j].username,
                            email: users[j].email
                        });
}

                }
            }

        }
    }

    let pet = await Pet.displayPetById(petId);

    res.render("edit-pet", { pet, viewers });
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