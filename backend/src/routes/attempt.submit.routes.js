const express = require("express");
const authmiddleware = require("../middleware/auth.middleware");
const { submitQuizController: submitExamController, getAttemptQuestions, violationController } = require("../controller/attempt.quizsubmit.controller");
const { getAttemptStatusController } = require('../controller/Student/getAttemptStatusController');
const submitrouter = express.Router();

submitrouter.get("/:attemptId/questions", authmiddleware, getAttemptQuestions)
submitrouter.get("/:attemptId/status", authmiddleware, getAttemptStatusController)

submitrouter.post('/:attemptId/submit', authmiddleware, submitExamController);
submitrouter.post('/:attemptId/violation', authmiddleware, violationController);

module.exports = submitrouter;