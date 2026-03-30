const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users-controller");
const authMiddleware = require("../middleware/auth");

router.get("/", usersController.displayLogin); 
router.post("/", usersController.submitLogin);

router.get("/user-register", usersController.displayRegister);
router.post("/user-register", usersController.submitRegister);

router.get("/user-edit", usersController.editProfile);
router.post('/user-edit', usersController.submitEditProfile);
router.post('/delete-account', usersController.deleteAccount);

router.get('/home', authMiddleware.isLoggedIn, authMiddleware.isAdopter,usersController.showHome);
router.get('/home-shelter', authMiddleware.isLoggedIn, authMiddleware.isShelter, usersController.showHomeShelter);

router.get('/logout', usersController.submitLogout);

module.exports = router;
