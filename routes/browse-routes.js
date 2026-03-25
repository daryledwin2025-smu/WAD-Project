const express = require("express");
const router = express.Router();
const petsController = require("../controllers/pets-controller");
const ReviewController = require("../controllers/ReviewController");

router.get("/",   petsController.displayAllPets);

router.get("/reviews/all", ReviewController.showAllReviews);
router.post("/reviews", ReviewController.submitReview);
router.get("/reviews/:id/edit", ReviewController.showEditReview);
router.post("/reviews/:id/edit", ReviewController.submitEditReview);
router.post("/reviews/:id/delete", ReviewController.deleteReview);
router.get("/petDetail",petsController.displayPetDetail);

module.exports = router;