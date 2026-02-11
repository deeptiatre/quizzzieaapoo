const express = require('express');
const { teacherDashboardController } = require('../../controller/Profile/teacher/teacherDashboardController');
const { teachergetAllQuizzesContoller } = require('../../controller/Profile/teacher/teacherAllQuizController');
const { teacherQuizStatsController } = require('../../controller/teacherStatsController');
const authmiddleware = require('../../middleware/auth.middleware');
const checkRoleMiddleware = require('../../middleware/role.auth.middleware');
const teacherDashboardRouter = express.Router();

teacherDashboardRouter.get('/teacherDashboard', authmiddleware, checkRoleMiddleware, teacherDashboardController)
teacherDashboardRouter.get('/teacherquizzes', authmiddleware, checkRoleMiddleware, teachergetAllQuizzesContoller)
teacherDashboardRouter.get('/teacherquiz/:quizId/stats', authmiddleware, checkRoleMiddleware, teacherQuizStatsController)

module.exports = { teacherDashboardRouter }