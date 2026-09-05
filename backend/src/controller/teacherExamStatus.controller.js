const attemptmodal = require("../modals/attempt.modal");
const QuizModal = require("../modals/quiz.modal");
const { examStateResolver } = require("../service/exam/examStateResolver.service");

const teacherExamStatusController = async (req, res) => {
    try {
        const { quizID } = req.params;
        const quiz = await QuizModal.findById(quizID);
        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }
        const state = await examStateResolver(quiz);
        const totalAttempts = await attemptmodal.countDocuments({ quizID });
        const completedAttempts = await attemptmodal.countDocuments({ quizID, endedAt: { $ne: null } });

        return res.status(200).json({
            message: "Exam status fetched successfully",
            examState: state,
            quizStatus: quiz.quizStatus,
            totalAttempts: totalAttempts,
            completedAttempts: completedAttempts

        });
    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message,
        });
    }
};
module.exports = { teacherExamStatusController };