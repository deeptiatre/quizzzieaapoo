const express = require('express');
const { leaderBoardController } = require('../controller/leaderboard.controller');
const { teacherLeaderBoardController } = require('../controller/teacher.leaderboard.controller');
const leaderRouter = express.Router();

leaderRouter.get('/:quizID/leaderBoard', leaderBoardController);
leaderRouter.get('/:quizID/teacher-leaderboard', teacherLeaderBoardController);

module.exports = leaderRouter;