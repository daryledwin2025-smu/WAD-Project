const express = require("express");
const router = express.Router();
const petsController = require("../controllers/pets-controller");
const authMiddleware = require("../middleware/auth");

// ROUTES
router.get("/myListings", authMiddleware.isLoggedIn, authMiddleware.isShelter, petsController.displayMyListings);
router.get("/addPet", authMiddleware.isLoggedIn, authMiddleware.isShelter, petsController.displayAddPet);
router.post("/addPet", authMiddleware.isLoggedIn, authMiddleware.isShelter, petsController.addPet);
router.get("/editPet", authMiddleware.isLoggedIn, authMiddleware.isShelter, petsController.displayEditPet);
router.post("/editPet", authMiddleware.isLoggedIn, authMiddleware.isShelter, petsController.editPet);
router.get("/deletePet", authMiddleware.isLoggedIn, authMiddleware.isShelter, petsController.deletePet);

// EXPORT
module.exports = router;
