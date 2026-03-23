const express = require("express");

const router = express.Router();
const usersController = require("../controllers/users-controller");

router.get("/user-login", usersController.displayLogin);
router.post("/user-login", usersController.submitLogin);
router.get("/user-register", usersController.displayRegister);
router.post("/user-register", usersController.submitRegister);
router.get("/user-edit", usersController.editProfile);
router.post('/delete-account', usersController.deleteAccount);

module.exports = router;
