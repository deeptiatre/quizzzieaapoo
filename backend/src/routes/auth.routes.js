const express = require('express');
const { registerController, loginController } = require('../controller/auth.controller');
const router = express.Router();


router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", require('../controller/auth.controller').logoutController);

module.exports = router;