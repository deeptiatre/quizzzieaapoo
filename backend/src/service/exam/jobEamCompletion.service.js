const QuizModal = require("../../modals/quiz.modal");
const { ensureEamCompletion } = require("./examCompletion.service");

const examCompletionJob = async () => {
    try {
        const now = new Date();

        const exams = await QuizModal.find({
            quizType: 'exam',
            'examConfig.endTime': { $lte: now }
        });

        for (const quiz of exams) {
            await ensureEamCompletion(quiz._id, true);
        }
    } catch (error) {
        console.error("Error in examCompletionJob:", error);
    }
};

module.exports = examCompletionJob;