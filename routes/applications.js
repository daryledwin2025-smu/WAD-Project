const express = require("express");
const router = express.Router();
const applicationsController = require("../controllers/applications-controller");

// View own applications 
router.get("/mine", applicationsController.showMyApplications); 

// submit new application (or save draft)
router.get("/new/:petId", applicationsController.displayApplyForm);
router.post("/new/:petId", applicationsController.submitApplication);

// edit a draft application
router.get("/edit/:appId", applicationsController.displayEditDraftForm);
router.post("/edit/:appId", applicationsController.submitDraftEdit);

// withdraw an application
router.post("/delete/:appId", applicationsController.deleteApplication);

module.exports = router;