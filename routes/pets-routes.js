const express = require("express");
const router = express.Router();
const petsController = require("../controllers/pets-controller");
// not done yet
// router.get("/myListings", (req,res)=>{res.send('hi')});
router.get("/addPet",petsController.displayAddPet);
router.post("/addPet",petsController.addPet);

// EXPORT
module.exports = router;