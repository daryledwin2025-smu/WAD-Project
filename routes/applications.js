const express = require("express");
const router = express.Router();
const applicationsController = require("../controllers/applications-controller");

const {isLoggedIn, isShelter} = require('../middleware/auth');

// ADOPTER ROUTES

// 1. View own applications 
router.get("/mine", isLoggedIn, applicationsController.showMyApplications); 

// 2. submit new application (or save draft)
router.post("/new/:petId", isLoggedIn, applicationsController.submitApplication);
// 3. router.get("/new/:petId", applicationsController.displayApplyForm);
router.get("/applyForm", isLoggedIn, applicationsController.displayApplyForm);

// 4. edit a draft application
router.get("/edit/:appId", isLoggedIn, applicationsController.displayEditDraftForm);
router.post("/edit/:appId", isLoggedIn, applicationsController.submitDraftEdit);

// 5. withdraw an application
router.post("/delete/:appId", isLoggedIn, applicationsController.deleteApplication);

// SHELTER ROUTES 
// 1. View the master list of ALL applications for the logged-in shelter
router.get('/shelter/all', isLoggedIn, isShelter, applicationsController.viewAllShelterApplications);

module.exports = router;