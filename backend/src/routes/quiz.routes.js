const express = require('express');
const authmiddleware = require('../middleware/auth.middleware');
const {
    CreateQuizController,
    addquestionController,
    updateQuestionController,
    deleteQuestionContoller,
    getQuizByIdController
} = require('../controller/quiz.controller');
const { publishQuizController } = require('../controller/publishQuizController');
const { deleteQuizController, forceEndExamController } = require('../controller/quizManageController');
const checkRoleMiddleware = require('../middleware/role.auth.middleware');


const quizRouter = express.Router();

quizRouter.post("/create", authmiddleware, checkRoleMiddleware, CreateQuizController)
quizRouter.post("/:quizID/addquestions", authmiddleware, checkRoleMiddleware, addquestionController)
quizRouter.get("/fetch/:quizID", authmiddleware, checkRoleMiddleware, getQuizByIdController)
quizRouter.put('/:questionID/update', authmiddleware, checkRoleMiddleware, updateQuestionController)
quizRouter.delete('/:questionID/delete', authmiddleware, checkRoleMiddleware, deleteQuestionContoller)
quizRouter.put('/:quizID/publish', authmiddleware, checkRoleMiddleware, publishQuizController)
quizRouter.delete('/:quizID', authmiddleware, checkRoleMiddleware, deleteQuizController) // Delete Quiz
quizRouter.put('/:quizID/force-end', authmiddleware, checkRoleMiddleware, forceEndExamController) // Force End Exam

module.exports = quizRouter;


