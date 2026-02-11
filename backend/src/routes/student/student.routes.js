const express = require("express");
const { joinExamController } = require("../../controller/Student/joinExamController");
const { startAttemptController } = require("../../controller/Student/startAttempController");
const { examEndController } = require("../../controller/Student/examEndController");
const examStudentroutes = express.Router();


const userAuth = require("../../middleware/auth.middleware");

const { getExamQuestionsController } = require("../../controller/Student/getExamQuestionsController");

examStudentroutes.post('/join-exam', userAuth, joinExamController);
examStudentroutes.post('/start-attempt', userAuth, startAttemptController);
examStudentroutes.get('/attempt/:attemptId/questions', userAuth, getExamQuestionsController);
examStudentroutes.post('/end-exam', userAuth, examEndController);

const { attemptResultController } = require("../../controller/attemptResultcontroller");
examStudentroutes.get('/result/:attemptId', userAuth, attemptResultController);

const { getLeaderboardController } = require("../../controller/Student/getLeaderboardController");
examStudentroutes.get('/leaderboard/:quizId', userAuth, getLeaderboardController);

module.exports = { examStudentroutes };