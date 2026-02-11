const express = require('express');
const teacherRouter = express.Router();
const authMiddleware = require('../../middleware/auth.middleware');
const checkRoleMiddleware = require('../../middleware/role.auth.middleware');
const { enableExamController } = require('../../controller/quiz.controller');
const {teacherExamStatusController} = require('../../controller/teacherExamStatus.controller');
const {teacherLeaderBoardController} = require('../../controller/teacher.leaderboard.controller');
const publishResultController = require('../..//controller/publishResult.controller');
const {forceExamEnsController} = require('../../controller/forceExamEnd.controller');

//enable exam
teacherRouter.post("/quiz/:quizID/enable-exam", authMiddleware, checkRoleMiddleware, enableExamController);

//exam status 
teacherRouter.get("/quiz/:quizID/exam-status", authMiddleware, checkRoleMiddleware,teacherExamStatusController);

//leaderboard
teacherRouter.get("/quiz/:quizID/leaderboard", authMiddleware, checkRoleMiddleware, teacherLeaderBoardController )


//publish result
teacherRouter.patch("/quiz/:quizID/publish-result", authMiddleware, checkRoleMiddleware, publishResultController);

//force exam end
teacherRouter.post("/quiz/:quizID/force-end", authMiddleware, checkRoleMiddleware, forceExamEnsController);


module.exports = teacherRouter;