const Favourite = require("../models/favourite-model");
const Pet = require("../models/pet-model");

exports.addFavourite = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect("/");
        }

        if (req.session.user.account === "Shelter") {
            return res.status(403).send("Shelters cannot favourite pets.");
        }

        const userId = req.session.user._id;
        const petId = req.body.petId;

        if (!petId) {
            return res.redirect("/home");
        }

        const pet = await Pet.displayPetById(petId);
        if (!pet) {
            return res.redirect("/home");
        }

        const existing = await Favourite.checkFavourite(userId, petId);
        if (existing) {

            return res.redirect("/favourites");
        }

        await Favourite.addFavourite(userId, petId);
        res.redirect("/favourites");
    } catch (error) {
        console.log("Error adding favourite:", error);
        res.redirect("/home");
    }
};

// ========== READ — View all favourites ==========
// GET /favourites
exports.viewFavourites = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect("/");
        }

        if (req.session.user.account === "Shelter") {
            return res.redirect("/home-shelter");
        }

        const userId = req.session.user._id;
        const favourites = await Favourite.getFavouritesByUserId(userId);

        const validFavourites = favourites.filter(fav => fav.petId !== null);

        res.render("favourites", { favourites: validFavourites, user: req.session.user });
    } catch (error) {
        console.log("Error viewing favourites:", error);
        res.redirect("/home");
    }
};

exports.showEditNote = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect("/");
        }

        const favouriteId = req.query.favouriteId;

        if (!favouriteId) {
            return res.redirect("/favourites");
        }

        const favourite = await Favourite.getFavouriteById(favouriteId);

        if (!favourite) {
            return res.redirect("/favourites");
        }

        if (favourite.userId.toString() !== req.session.user._id.toString()) {
            return res.status(403).send("You cannot edit this favourite.");
        }

        res.render("editNote", { favourite, user: req.session.user });
    } catch (error) {
        console.log("Error showing edit note:", error);
        res.redirect("/favourites");
    }
};

exports.submitEditNote = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect("/");
        }

        const favouriteId = req.body.favouriteId;
        const note = req.body.note || "";

        if (!favouriteId) {
            return res.redirect("/favourites");
        }

        const favourite = await Favourite.getFavouriteById(favouriteId);

        if (!favourite) {
            return res.redirect("/favourites");
        }

        if (favourite.userId.toString() !== req.session.user._id.toString()) {
            return res.status(403).send("You cannot edit this favourite.");
        }

        await Favourite.updateNote(favouriteId, note.trim());
        res.redirect("/favourites");
    } catch (error) {
        console.log("Error updating note:", error);
        res.redirect("/favourites");
    }
};

exports.removeFavourite = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.redirect("/");
        }

        const favouriteId = req.body.favouriteId;

        if (!favouriteId) {
            return res.redirect("/favourites");
        }

        const favourite = await Favourite.getFavouriteById(favouriteId);

        if (!favourite) {
            return res.redirect("/favourites");
        }

        if (favourite.userId.toString() !== req.session.user._id.toString()) {
            return res.status(403).send("You cannot remove this favourite.");
        }

        await Favourite.removeFavourite(favouriteId);
        res.redirect("/favourites");
    } catch (error) {
        console.log("Error removing favourite:", error);
        res.redirect("/favourites");
    }
};
