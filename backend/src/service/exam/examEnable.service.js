const QuestionModal = require("../../modals/question.modal");
const QuizModal = require("../../modals/quiz.modal")
const crypto = require('crypto');
const enableExamService = async ({ quizID, examConfig, userID }) => {

    const quiz = await QuizModal.findById(quizID);
    if (!quiz) {
        throw new Error("QUIZ_NOT_FOUND");
    }

    if (quiz.createdby.toString() !== userID.toString()) {
        throw new Error("NOT_AUTHORIZED");
    }
    if (quiz.quizType !== 'normal' || quiz.quizStatus !== 'draft') {
        throw new Error("INVALID_QUIZ_STATE");
    }

    const questionCount = await QuestionModal.countDocuments({ quizID: quizID });
    if (questionCount < 2) {
        throw new Error("NO_QUESTIONS");
    }

    const { startTime, endTime, durationMinutes, autosubmit } = examConfig;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start) || isNaN(end) || start >= end) {
        throw new Error("INVALID_TIME");
    }

    const windowDuration = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));

    if (durationMinutes > windowDuration) {
        throw new Error("DURATION_EXCEEDS_WINDOW");
    }

    const examCode = examConfig.examCode || crypto.randomBytes(4).toString('hex').toUpperCase();


    const autoSubmitConfig = {
        timeEnd: autosubmit?.timeEnd ?? true,
        tabSwitch: autosubmit?.tabSwitch ?? true,
        copyPaste: autosubmit?.copyPaste ?? false
    };

    quiz.quizType = 'exam';
    quiz.quizStatus = 'upcoming';
    quiz.examConfig = {
        startTime,
        endTime,
        durationMinutes,
        autosubmit: autoSubmitConfig,
        examCode,
        maxTabSwitch: examConfig.maxTabSwitch ?? 3,

    };
    await quiz.save();

    return {
        quizID: quiz._id,
        examCode: examCode,
        quizStatus: quiz.quizStatus,
        examConfig: quiz.examConfig

    }
}

module.exports = enableExamService;