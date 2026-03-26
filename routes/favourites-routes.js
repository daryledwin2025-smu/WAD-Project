const express = require("express");
const router = express.Router();
const favouritesController = require("../controllers/favourites-controller");
const { isLoggedIn, isAdopter } = require("../middleware/auth");

router.get("/", isLoggedIn, isAdopter, favouritesController.viewFavourites);
router.post("/add", isLoggedIn, isAdopter, favouritesController.addFavourite);
router.get("/editNote", isLoggedIn, isAdopter, favouritesController.showEditNote);
router.post("/editNote", isLoggedIn, isAdopter, favouritesController.submitEditNote);
router.post("/remove", isLoggedIn, isAdopter, favouritesController.removeFavourite);

module.exports = router;
