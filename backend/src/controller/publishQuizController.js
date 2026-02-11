const QuizModal = require("../modals/quiz.modal");
const QuestionModal = require("../modals/question.modal");

const publishQuizController = async (req, res) => {
    try {
        const { quizID } = req.params;
        const userId = req.user._id;

        const quiz = await QuizModal.findById(quizID);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (quiz.createdby.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized: You are not the creator of this quiz" });
        }

        if (quiz.quizStatus !== 'draft') {
            return res.status(400).json({ message: "Quiz is already published or in exam mode" });
        }

        // Check validation: Minimum questions ?
        const questionCount = await QuestionModal.countDocuments({ quizID: quiz._id });
        if (questionCount < 1) {
            return res.status(400).json({ message: "Cannot publish a quiz with no questions" });
        }

        quiz.quizStatus = 'normal';
        await quiz.save();

        return res.status(200).json({
            message: "Quiz published successfully",
            quiz
        });

    } catch (error) {
        console.error("Publish Quiz Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = { publishQuizController };
