const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard-controller")



router.get("/", dashboardController.showDashboard);

router.get("/applicationDetails/:id", dashboardController.showApplications);

router.post("/updatedApplicationDetails", dashboardController.updateApplicationDetails);

module.exports = router;