const express = require('express');
const authmiddleware = require('../middleware/auth.middleware');
const {  attemptResultController } = require('../controller/attemptResultcontroller');
const attemptRouter = express.Router();




attemptRouter.get("/:attemptId/result",authmiddleware,attemptResultController );

module.exports = attemptRouter;