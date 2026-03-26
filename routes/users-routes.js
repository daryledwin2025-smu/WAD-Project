const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users-controller");

router.get("/", usersController.displayLogin); // edited the root to be login page
router.post("/", usersController.submitLogin);

router.get("/user-register", usersController.displayRegister);
router.post("/user-register", usersController.submitRegister);

router.get("/user-edit", usersController.editProfile);
router.post('/delete-account', usersController.deleteAccount);

router.get('/home', usersController.showHome);
router.get('/home-shelter', usersController.showHomeShelter);

module.exports = router;
