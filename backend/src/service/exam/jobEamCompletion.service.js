const QuizModal = require("../../modals/quiz.modal");
const { ensureEamCompletion } = require("./examCompletion.service");

const examCompletionJob = async () => {

    const now = new Date();

    const exam = await QuizModal.find({
        quizType: 'exam',
        'examConfig.endTime': { $lte: now },
        quizStatus: { $ne: 'completed' }
    })

    for (const quiz of exam) {
        await ensureEamCompletion(quiz._id);
    }

}
module.exports = examCompletionJob;