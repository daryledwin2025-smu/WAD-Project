const Pet = require("../models/pet-model");
const UserModel = require("../models/user-model");
const Favourite = require("../models/favourite-model");
const View = require("../models/view-model");
const Application = require("../models/Application");
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
    // CHECK IF PET IS ADOPTED
for (let i = 0; i < allPets.length; i++) {

    let approvedApp = await Application.findOne({
        pet: allPets[i]._id,
        status: "Approved"
    });

    allPets[i].isAdopted = approvedApp ? true : false;
}

// 🔥 HIDE adopted pets by default
if (!req.query.showAdopted) {
    allPets = allPets.filter(pet => !pet.isAdopted);
}
    // VIEWS
    let allViews = await View.retrieveAll();
    for (let i = 0; i < allPets.length; i++) {

        // 👀 VIEW COUNT
        let count = 0;
        for (let j = 0; j < allViews.length; j++) {
            if (allViews[j].petId.toString() === allPets[i]._id.toString()) {
                count++;
            }
        }
        allPets[i].viewCount = count;

        // 📝 APPLICATION COUNT (ONLY PENDING)
        let applications = await Application.find({
            pet: allPets[i]._id,
            status: "Pending"
        }).populate("applicant");
        applications = applications.filter(app=>app.applicant);

        allPets[i].applicationCount = applications.length;
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
if (req.query.sort === "views_desc") {
    allPets.sort((a, b) => b.viewCount - a.viewCount);
}

if (req.query.sort === "views_asc") {
    allPets.sort((a, b) => a.viewCount - b.viewCount);
}

if (req.query.sort === "apps_desc") {
    allPets.sort((a, b) => b.applicationCount - a.applicationCount);
}

if (req.query.sort === "apps_asc") {
    allPets.sort((a, b) => a.applicationCount - b.applicationCount);
}
    res.render("myListings", { allPets, req, breeds });
};

exports.displayAddPet = (req, res) => {
    res.render("add-pet",{error:null,pet:{}});
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
        // description
        if (pet.description && pet.description.length > 200) {
            return res.render("add-pet", {
                error: "Description cannot exceed 200 characters",
                pet: pet
            });
        }
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
        // CHECK IF PET IS ADOPTED
        for (let i = 0; i < allPets.length; i++) {

            let approvedApp = await Application.findOne({
                pet: allPets[i]._id,
                status: "Approved"
            });

            allPets[i].isAdopted = approvedApp ? true : false;
        }

        // REMOVE adopted pets
        allPets = allPets.filter(pet => !pet.isAdopted);
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
}// popular pets (e.g. top views)
let popularPets = [...allPets]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

        // VIEWS LOOP
        for (let i = 0; i < allPets.length; i++) {
            let count = 0;

            for (let j = 0; j < allViews.length; j++) {
                if (allViews[j].petId.toString() === allPets[i]._id.toString()) {
                    count++;
                }
            }
            allPets[i].viewCount = count; // attach to each pet
    // 🔥 APPLICATION COUNT
    let applications = await Application.find({
        pet: allPets[i]._id,
        status: { $in: ["Pending"] }
    }).populate("applicant");
    applications = applications.filter(app => app.applicant);

    allPets[i].applicationCount = applications.length;
}
if (req.query.sort === "views_desc") {
    allPets.sort((a, b) => b.viewCount - a.viewCount);
}

if (req.query.sort === "views_asc") {
    allPets.sort((a, b) => a.viewCount - b.viewCount);
}

if (req.query.sort === "apps_desc") {
    allPets.sort((a, b) => b.applicationCount - a.applicationCount);
}

if (req.query.sort === "apps_asc") {
    allPets.sort((a, b) => a.applicationCount - b.applicationCount);
}

        // Darryl's reviews logic
        const Review = require("../models/Review");
        const reviews = await Review.find({ shelter: shelterId }) // read from reviews collection, .find comes in the model automatically (find reviews for the specific shelter and create a list)
            .populate("reviewer", "username") // reviewer is an objectId pointing to user collection (based on schema), populates reviewer with that ObjectId and the username
            //   reviewer: {
            //   _id: new ObjectId('69c4db65615b4d548e5c643c'),
            //    username: 'darryl'
            // }
            .populate("applicationId", "petName")
            .sort({ createdAt: -1 }); // sort in descending order of date
            

        const validReviews = reviews.filter(review => review.reviewer !== null).slice(0, 3); // keep element if condition is true
        // filter out any reviews whose userID may be deleted, and show the first 3 only

        let totalRating = 0
        validReviews.forEach(review => {
            totalRating += review.rating
        }); // calculate totalRating to find average later

        const avgRating = validReviews.length > 0
            ? (totalRating / validReviews.length).toFixed(1)
            : null; // calc the avgRating, if no reviews, leave it as null

        let favouritedPetIds = [];
        if (req.session.user && req.session.user.account !== "Shelter") {
            const userFavs = await Favourite.getFavouritesByUserId(req.session.user._id);
            favouritedPetIds = userFavs.filter(f => f.petId !== null).map(f => f.petId._id.toString());
        }

        res.render("browse", { allPets, reviews: validReviews, avgRating, shelterId, shelter, user: req.session.user, req, favouritedPetIds, breeds, popularPets });
    } catch (error) {
        console.error(error);
        res.send("Error reading database"); // Send error message if fetching fails
    }
}

exports.displayPetDetail = async (req, res) => {
    let petId = req.query.petId;
    let pet = await Pet.displayPetById(petId);
    let userViewCount = 0;

    // CREATE VIEW RECORD
    if (req.session.user) {
    await View.addView({
        petId,
        userId: req.session.user._id
    });
    // get THIS user's view record
        let view = await View.findByPetAndUser(petId, req.session.user._id);

        if (view) {
            userViewCount = view.viewCount;
        }
}

    let viewCount = await View.countByPetId(petId);

    // Check if this pet is already favourited by the user
    let isFavourited = false;
    if (req.session.user && req.session.user.account !== "Shelter") {
        const existing = await Favourite.checkFavourite(req.session.user._id, petId);
        isFavourited = !!existing;
    }

    res.render("pet-detail", { pet, user: req.session.user, userViewCount, isFavourited });
}

exports.displayEditPet = async (req, res) => {
    let petId = req.query.petId;

    // get only views for this pet
// VIEWERS (reuse logic)
let views = await View.findByPetId(petId);
let viewers = [];

for (let i = 0; i < views.length; i++) {

    if (!views[i].userId) continue;

    let user = await UserModel.getUserById(views[i].userId);
// 🔥 CHECK IF APPLIED
    let application = await Application.findOne({
        pet: petId,
        applicant: views[i].userId
    });
    if (user) {
        viewers.push({
            username: user.username,
            email: user.email,
            viewedAt: views[i].viewedAt,
            viewCount: views[i].viewCount,
            hasApplied: application?true:false  
        });
    }
}
// SEARCH FILTER FOR VIEWERS
if (req.query.search && req.query.search.trim() !== "") {
    const search = req.query.search.toLowerCase();

    viewers = viewers.filter(v =>
        v.username.toLowerCase().includes(search) ||
        v.email.toLowerCase().includes(search)
    );
}
// SORT
if (req.query.sort === "highest") {
    viewers.sort((a, b) => b.viewCount - a.viewCount);
}

if (req.query.sort === "lowest") {
    viewers.sort((a, b) => a.viewCount - b.viewCount);
}

// STATUS FILTER
if (req.query.status === "applied") {
    viewers = viewers.filter(v => v.hasApplied);
}

if (req.query.status === "interested") {
    viewers = viewers.filter(v => !v.hasApplied && v.viewCount >= 5);
}

if (req.query.status === "browsing") {
    viewers = viewers.filter(v => !v.hasApplied && v.viewCount < 5);
}

    let pet = await Pet.displayPetById(petId);

    res.render("edit-pet", { pet, viewers, error: null,req });
};

exports.editPet = async (req, res) => {
    let pet = req.body;

    // handle checkboxes
    pet.vaccinated = pet.vaccinated ? true : false;
    pet.neutered = pet.neutered ? true : false;
    pet.houseTrained = pet.houseTrained ? true : false;

    try {
        // ✅ validation
        if (pet.description && pet.description.length > 200) {
            
// VIEWERS
let views = await View.retrieveAll();
let users = await UserModel.getAllUsers();

let viewers = [];

for (let i = 0; i < views.length; i++) {

    // only for this pet + skip null users
    if (
        views[i].petId.toString() === pet._id.toString() &&
        views[i].userId
    ) {

        for (let j = 0; j < users.length; j++) {

            if (users[j]._id.toString() === views[i].userId.toString()) {

                let existing = viewers.find(v => v.username === users[j].username);

                if (!existing) {
                    viewers.push({
                        username: users[j].username,
                        email: users[j].email,
                        viewedAt: views[i].viewedAt,
                        viewCount:views[i].viewCount
                    });
                } else {
                    // keep latest view time
                    if (views[i].viewedAt > existing.viewedAt) {
                        existing.viewedAt = views[i].viewedAt;
                    }
                }

            }
        }
    }
}

            return res.render("edit-pet", {
                error: "Description cannot exceed 200 characters",
                pet,
                viewers
            });
        }

        let result = await Pet.editPet(pet);
        res.redirect('/pets/myListings');

    } catch (error) {
        console.log(error);

        res.render("edit-pet", {
            error: "Error updating pet",
            pet,
            viewers: []
        });
    }
};

exports.deletePet = async (req, res) => {
    const petId = req.query.petId;
    try {
        // delete all views FIRST
        await View.deleteByPetId(petId);
        // then delete pet
        let success = await Pet.deletePet(petId);
        if (success.deletedCount === 1) {
            console.log('Deleted Pet + Views');
        }
        res.redirect("/pets/myListings");
    } catch (error) {
        console.log(error);
        res.redirect("/pets/myListings");
    }
};

// exports.deletePetByShelterId = async(req,res)=>{
//     const shelterId = req.session.user._id;
//     await Pet.deletePetsByShelterId(shelterId);
// }