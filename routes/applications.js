const express = require("express");
const router = express.Router();
const applicationsController = require("../controllers/applications-controller");

// ADOPTER ROUTES

// 1. View own applications 
router.get("/mine", applicationsController.showMyApplications); 

// 2. submit new application (or save draft)
// 3. router.get("/new/:petId", applicationsController.displayApplyForm);
router.post("/new/:petId", applicationsController.submitApplication);
router.get("/applyForm", applicationsController.displayApplyForm);

// 4. edit a draft application
router.get("/edit/:appId", applicationsController.displayEditDraftForm);
router.post("/edit/:appId", applicationsController.submitDraftEdit);

// 5. withdraw an application
router.post("/delete/:appId", applicationsController.deleteApplication);

//======================================================================

// SHELTER ROUTES 

// 1. View the master list of ALL applications for the logged-in shelter
router.get('/shelter/all', applicationsController.viewAllShelterApplications);

// 2. View all applications for a specific pet
router.get("/pet/:petId", applicationsController.viewPetApplications);

// 3. Approve or Reject an application
router.post("/status/:appId", applicationsController.updateApplicationStatus);

router.get("/viewApplications", applicationsController.displayViewApplicationsByPet);

module.exports = router;