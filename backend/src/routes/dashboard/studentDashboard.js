const express = require('express');
const { getStudentDashboardController } = require('../../controller/Profile/student/studentDashboardController');
const { getMyAttemptController } = require('../../controller/Profile/student/myAttempController');
const authmiddleware = require('../../middleware/auth.middleware');
const studentDashboardRouter = express.Router();

studentDashboardRouter.get('/studentDashboard', authmiddleware, getStudentDashboardController)
studentDashboardRouter.get('/studentattempt', authmiddleware, getMyAttemptController)

module.exports = { studentDashboardRouter }