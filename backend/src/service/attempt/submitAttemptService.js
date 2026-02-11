const attemptmodal = require("../../modals/attempt.modal");
const QuizModal = require("../../modals/quiz.modal");
const { finalizAttempt } = require("../grading/calcutlating.score.service");
const { examStateResolver } = require("../exam/examStateResolver.service");

const submitAttemptService = async ({
    attemptId,
    userId,
    answers,
    submitReason,
    autoSubmitted
}) => {
    const attempt = await attemptmodal.findById(attemptId);

    if (!attempt) {
        throw new Error('Invalid_Attempt');
    }

    if (attempt.userID.toString() !== userId.toString()) {
        throw new Error('Unauthorized_Access');
    }
    if (attempt.endedAt) {
        throw new Error('Attempt_Already_Submitted');
    }

    const quiz = await QuizModal.findById(attempt.quizID);

    if (!quiz) {
        throw new Error('Associated_Quiz_Not_Found');
    }

    // if (quiz.quizType === 'exam' && submitReason === 'manual') {
    //     const state = await examStateResolver(quiz);
    //     if (state !== 'live') {
    //         throw new Error('Exam_Not_Live');
    //     }
    // }

    return await finalizAttempt({
        attempt,
        answers,
        submitReason,
        autoSubmitted
    })

}
module.exports = { submitAttemptService };