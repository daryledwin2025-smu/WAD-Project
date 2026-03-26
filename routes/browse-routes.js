const express = require("express");
const router = express.Router();
const petsController = require("../controllers/pets-controller");
router.get("/",   petsController.displayAllPets);
module.exports = router;