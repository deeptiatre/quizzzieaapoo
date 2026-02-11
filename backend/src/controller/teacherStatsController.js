const attemptmodal = require('../modals/attempt.modal');
const { leaderBoardService } = require('../service/leaderboard/leaderBoard.service')
const teacherQuizStatsController = async (req, res) => {

    const { quizId } = req.params;

    const leaderBoard = await leaderBoardService(quizId);
    const totalAttempt = await attemptmodal.countDocuments({ quizID: quizId });
    const autoSubmitted = await attemptmodal.countDocuments({
        quizID: quizId,
        autoSubmitted: true
    });

    return res.json({
        totalAttempt,
        leaderBoard,
        autoSubmitted
    })
}

module.exports = { teacherQuizStatsController }