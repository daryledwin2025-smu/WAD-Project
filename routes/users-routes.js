const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users-controller");
const authMiddleware = require("../middleware/auth");

router.get("/user-login", usersController.displayLogin); 
router.post("/user-login", usersController.submitLogin);

router.get("/user-register", usersController.displayRegister);
router.post("/user-register", usersController.submitRegister);

router.get('/home', authMiddleware.isLoggedIn, authMiddleware.isAdopter,usersController.showHome);
router.get('/home-shelter', authMiddleware.isLoggedIn, authMiddleware.isShelter, usersController.showHomeShelter);

router.get("/user-edit", authMiddleware.isLoggedIn, usersController.editProfile);
router.post('/user-edit', authMiddleware.isLoggedIn, usersController.submitEditProfile);
router.post("/change-password", authMiddleware.isLoggedIn, usersController.changePassword);
router.post('/delete-account', authMiddleware.isLoggedIn, usersController.deleteAccount);
router.get('/logout', usersController.submitLogout);

module.exports = router;
