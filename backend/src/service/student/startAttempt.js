const attemptmodal = require("../../modals/attempt.modal");
const QuestionModal = require("../../modals/question.modal");
const QuizModal = require("../../modals/quiz.modal");
const { examStateResolver } = require("../exam/examStateResolver.service");

const startAttemptService = async ({ userID, quizID }) => {

    const quiz = await QuizModal.findById(quizID);

    if (!quiz || quiz.quizType !== 'exam') {
        throw new Error('Invalid_QuizExam');
    }

    const examState = examStateResolver(quiz);

    if (examState !== 'live') {
        throw new Error('Exam_Not_Live');
    }

    let attempt = await attemptmodal.findOne({
        quizID,
        userID
    });

    if (attempt) {
        return {
            attemptId: attempt._id,
            quizID: quiz._id,
            startedAt: attempt.startedAt,
            endTime: quiz.examConfig.endTime,
            autoSubmit: quiz.examConfig.autoSubmit
        };
    }

    const question = await QuestionModal.find({
        quizID: quiz._id
    }).select('_id');

    if (question.length === 0) {
        throw new Error('No_Questions_Found');
    }
    attempt = await attemptmodal.create({
        quizID: quiz._id,
        userID,
        questionIds: question.map((q) => q._id),
        startedAt: Date.now()
    });

    return {
        attemptId: attempt._id,
        quizID: quiz._id,
        startedAt: attempt.startedAt,
        endTime: quiz.examConfig.endTime,
        autoSubmit: quiz.examConfig.autoSubmit
    };
};
module.exports = { startAttemptService };
