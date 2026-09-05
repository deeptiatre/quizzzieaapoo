const QuestionModal = require("../../modals/question.modal");
const QuizModal = require("../../modals/quiz.modal");
const { autoSubmitService } = require("./autoSubmit.service");
const { examStateResolver } = require("./examStateResolver.service");

const ensureEamCompletion = async (quizId, force = false) => {
    try {
        const quiz = await QuizModal.findById(quizId);
        if (!quiz || quiz.quizType !== 'exam') return;

        const currentState = examStateResolver(quiz);

        if (force || currentState === 'completed' || (quiz.examConfig?.endTime && new Date() >= new Date(quiz.examConfig.endTime))) {
            await autoSubmitService(quizId);
            
            quiz.quizStatus = 'normal';
            quiz.quizType = 'normal';
            quiz.isPractice = true;
            quiz.publishResults = true;

            await quiz.save();
            console.log(`[ExamCompletion] Quiz ${quizId} converted to normal practice quiz successfully.`);
        }
    } catch (err) {
        console.error(`[ExamCompletion] Error completing exam ${quizId}:`, err);
    }
};

module.exports = { ensureEamCompletion };