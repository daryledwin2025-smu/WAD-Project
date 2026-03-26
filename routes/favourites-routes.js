const express = require("express");
const router = express.Router();
const favouritesController = require("../controllers/favourites-controller");


router.get("/", favouritesController.viewFavourites);
router.post("/add", favouritesController.addFavourite);
router.get("/editNote", favouritesController.showEditNote);
router.post("/editNote", favouritesController.submitEditNote);
router.post("/remove", favouritesController.removeFavourite);

module.exports = router;
