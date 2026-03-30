const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users-controller");

router.get("/", usersController.displayLogin); 
router.post("/", usersController.submitLogin);

router.get("/user-register", usersController.displayRegister);
router.post("/user-register", usersController.submitRegister);

router.get("/user-edit", usersController.editProfile);
router.post('/user-edit', usersController.submitEditProfile);
router.post('/delete-account', usersController.deleteAccount);

router.get('/home', usersController.showHome);
router.get('/home-shelter', usersController.showHomeShelter);

router.get('/logout', usersController.submitLogout);
router.get('/index.html', (req, res) => {
    res.render('user-login'); 
});

module.exports = router;
