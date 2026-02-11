const QuizModal = require("../../modals/quiz.modal");
const { examStateResolver } = require("../../service/exam/examStateResolver.service");
const { leaderBoardService } = require("../../service/leaderboard/leaderBoard.service");

const examEndController = async (req, res) => {
    try {

        const { quizid } = req.params;
        const quiz = await QuizModal.findById(quizid);

        if (!quiz) {
            return res.status(400).json({
                message: 'Invalid_QuizExam'
            });
        }

        const state = examStateResolver(quiz);
        if (state !== 'completed') {
            return res.status(400).json({
                message: 'Exam_Not_Ended_Yet'
            });
        }

        const leaderboard = await leaderBoardService(quizid);

        return res.status(200).json({
            message: 'Exam_Ended_Successfully',
            data: leaderboard
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });

    }
};
module.exports = { examEndController };