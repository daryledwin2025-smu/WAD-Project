const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard-controller")
const authMiddleware = require("../middleware/auth");


router.get("/", authMiddleware.isLoggedIn, authMiddleware.isShelter, dashboardController.showDashboard);

router.get("/applicationDetails/:id", authMiddleware.isLoggedIn, authMiddleware.isShelter, dashboardController.showApplications);

router.post("/updatedApplicationDetails",authMiddleware.isLoggedIn, authMiddleware.isShelter, dashboardController.updateApplicationDetails);

router.get("/descisionlogs", authMiddleware.isLoggedIn, authMiddleware.isShelter, dashboardController.showDescisionLogs);

router.get("/withdrawdescisionlog", authMiddleware.isLoggedIn, authMiddleware.isShelter, dashboardController.withdrawDescisionLog);

module.exports = router;