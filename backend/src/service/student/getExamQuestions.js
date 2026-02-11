const attemptmodal = require("../../modals/attempt.modal");
const QuestionModal = require("../../modals/question.modal");
const QuizModal = require("../../modals/quiz.modal");

const getExamQuestionsService = async ({ attemptId, userID }) => {

    // 1. Find Attempt
    const attempt = await attemptmodal.findOne({
        _id: attemptId,
        userID: userID
    });

    if (!attempt) {
        throw new Error('Attempt_Not_Found');
    }

    // 2. Get Question IDs
    // We check 'questionIds' (schema field)
    let qIds = attempt.questionIds;

    // Recovery: If attempt has no questions, fetch from Quiz
    if (!qIds || qIds.length === 0) {
        const quizQuestions = await QuestionModal.find({ quizID: attempt.quizID }).select('_id');
        qIds = quizQuestions.map(q => q._id);
    }

    // 3. Fetch Questions (Sanitized)
    const questions = await QuestionModal.find({
        _id: { $in: qIds }
    }).select('-correctOption -explanation'); // Exclude answers

    // 4. Fetch Duration (to verify)
    // 4. Calculate Remaining Duration & Fetch Answers
    const quiz = await QuizModal.findById(attempt.quizID).select('examConfig');

    let remainingTimeSeconds = quiz?.examConfig?.durationMinutes * 60 || 600;

    // Logic for resume:
    // If startedAt exists, calculate elapsed time
    if (attempt.startedAt) {
        const now = new Date();
        const start = new Date(attempt.startedAt);
        const elapsedSeconds = Math.floor((now - start) / 1000);
        remainingTimeSeconds = Math.max(0, remainingTimeSeconds - elapsedSeconds);
    }

    // Also return existing answers for resume
    // Map existing answers to { questionID: optionID } format if needed by frontend
    const existingAnswers = {};
    if (attempt.answers && attempt.answers.length > 0) {
        attempt.answers.forEach(ans => {
            if (ans.selectedOption) {
                existingAnswers[ans.questionID] = ans.selectedOption;
            }
        });
    }

    return {
        questions,
        durationMinutes: remainingTimeSeconds / 60, // Keep for backward compatibility if needed
        remainingSeconds: remainingTimeSeconds,     // 👈 Frontend expects this
        answers: existingAnswers
    };
};

module.exports = { getExamQuestionsService };
