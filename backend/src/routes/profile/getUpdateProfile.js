const express = require('express');
const { getMyProfileController, updateMyProfileController } = require('../../controller/Profile/myProfile.controller.both');
const authmiddleware = require('../../middleware/auth.middleware');
const profileRouter = express.Router();

profileRouter.get('/getprofile',authmiddleware, getMyProfileController);
profileRouter.put('/updateprofile',authmiddleware, updateMyProfileController);

module.exports = {profileRouter}