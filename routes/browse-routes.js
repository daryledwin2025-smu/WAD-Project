const express = require("express");
const router = express.Router();
const petsController = require("../controllers/pets-controller");
const ReviewController = require("../controllers/review-controller");
const authMiddleware = require("../middleware/auth");

router.get("/",  authMiddleware.isLoggedIn, authMiddleware.isAdopter, petsController.displayAllPets);

router.get("/reviews/all", authMiddleware.isLoggedIn, ReviewController.showAllReviews); // allow both shelter and adopter to see reviews    
router.get("/reviews/new", authMiddleware.isLoggedIn, authMiddleware.isAdopter, ReviewController.showNewReviewForm);
router.post("/reviews/new", authMiddleware.isLoggedIn, authMiddleware.isAdopter, ReviewController.submitNewReview);

router.get("/reviews/:id/edit", authMiddleware.isLoggedIn, authMiddleware.isAdopter, ReviewController.showEditReview);
router.post("/reviews/:id/edit", authMiddleware.isLoggedIn, authMiddleware.isAdopter, ReviewController.submitEditReview);
router.post("/reviews/:id/delete", authMiddleware.isLoggedIn, authMiddleware.isAdopter, ReviewController.deleteReview);
router.get("/petDetail", authMiddleware.isLoggedIn, authMiddleware.isAdopter, petsController.displayPetDetail);

module.exports = router;