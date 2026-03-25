const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard-controller")



router.get("/", dashboardController.showDashboard);

router.get("/applicationDetails", dashboardController.showApplications);

router.post("/applicationDetails", dashboardController.showApplications);

module.exports = router;