const express = require("express");
const router = express.Router();
const petsController = require("../controllers/pets-controller");
// not done yet
router.get("/myListings", petsController.displayMyListings);
router.get("/addPet",petsController.displayAddPet);
router.post("/addPet",petsController.addPet);
router.get("/editPet",petsController.displayEditPet);
router.post("/editPet",petsController.editPet);
router.get("/deletePet",petsController.deletePet);




// EXPORT
module.exports = router;