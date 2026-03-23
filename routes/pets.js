const express = require("express");
const router = express.Router();
const petsController = require("../controllers/pets");
router.get("/myListings",   (req,res)=>{res.send('hi')});
module.exports = router;