const express = require('express');
const {
  getAllQuizesController,
  getQuizBydifficultyController,

  StartQuizController } = require('../controller/quizfetch.controller');
const { getQuizzesByTopicController } = require('../controller/topicWiseQuizController');
const authmiddleware = require('../middleware/auth.middleware');
const quizFetchrouter = express.Router();



quizFetchrouter.get("/allquizes", authmiddleware, getAllQuizesController);
quizFetchrouter.get("/difficulty/:level", authmiddleware, getQuizBydifficultyController);
quizFetchrouter.get("/topic/:topic", authmiddleware, getQuizzesByTopicController);
quizFetchrouter.post("/:quizID/start", authmiddleware, StartQuizController);

module.exports = quizFetchrouter;