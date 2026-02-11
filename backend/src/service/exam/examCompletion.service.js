const QuestionModal = require("../../modals/question.modal");
const QuizModal = require("../../modals/quiz.modal");
const { autoSubmitService } = require("./autoSubmit.service");
const { examStateResolver } = require("./examStateResolver.service");

const ensureEamCompletion = async (quizId) => {
    const quiz = await QuizModal.findById(quizId);
    if (!quiz || quiz.quizType !== 'exam') return;

    const currentState = examStateResolver(quiz);

    if (currentState === 'completed' && quiz.quizStatus !== 'completed') {
        await autoSubmitService(quizId);
        quiz.quizStatus = 'completed';

        quiz.quizType = 'normal';
        quiz.examConfig = null;
        quiz.isPractice = true;

        await quiz.save();
    }

}
module.exports = { ensureEamCompletion };