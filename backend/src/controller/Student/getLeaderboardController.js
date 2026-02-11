const { leaderBoardService } = require('../../service/leaderboard/leaderBoard.service');
const QuizModal = require('../../modals/quiz.modal');

const getLeaderboardController = async (req, res) => {
    try {
        const { quizId } = req.params;

        const quiz = await QuizModal.findById(quizId);
        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        const leaderboard = await leaderBoardService(quizId);

        return res.status(200).json({
            message: "Leaderboard fetched successfully",
            leaderBoard: leaderboard
        });

    } catch (error) {
        console.error("Error in getLeaderboardController:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = { getLeaderboardController };
