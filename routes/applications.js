const express = require("express");
const router = express.Router();
const applicationsController = require("../controllers/applications-controller");

// View own applications 
router.get("/mine", applicationsController.showMyApplications); 

// submit new application (or save draft)
// router.get("/new/:petId", applicationsController.displayApplyForm);
router.post("/new/:petId", applicationsController.submitApplication);
 router.get("/applyForm", applicationsController.displayApplyForm);

// edit a draft application
router.get("/edit/:appId", applicationsController.displayEditDraftForm);
router.post("/edit/:appId", applicationsController.submitDraftEdit);

// withdraw an application
router.post("/delete/:appId", applicationsController.deleteApplication);

// [SHELTER] View the master list of ALL applications
router.get('/shelter/all', applicationsController.viewAllShelterApplications);

module.exports = router;