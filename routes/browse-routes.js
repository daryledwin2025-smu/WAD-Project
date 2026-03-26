const express = require("express");
const router = express.Router();
const petsController = require("../controllers/pets-controller");
const ReviewController = require("../controllers/ReviewController");
const { isLoggedIn, isAdopter } = require("../middleware/auth");

router.get("/",   petsController.displayAllPets);

router.get("/reviews/all", isLoggedIn, isAdopter, ReviewController.showAllReviews);
router.post("/reviews", isLoggedIn, isAdopter, ReviewController.submitReview);
router.get("/reviews/:id/edit", isLoggedIn, isAdopter, ReviewController.showEditReview);
router.post("/reviews/:id/edit", isLoggedIn, isAdopter, ReviewController.submitEditReview);
router.post("/reviews/:id/delete", isLoggedIn, isAdopter, ReviewController.deleteReview);

router.get("/petDetail",petsController.displayPetDetail);

module.exports = router;