const attemptmodal = require("../../modals/attempt.modal");
const QuizModal = require("../../modals/quiz.modal");
const { examStateResolver } = require("../exam/examStateResolver.service");

const joinExamService = async ({ examCode, userID }) => {

    console.log(`Querying QuizModal with: code="${examCode}", type="exam"`);
    const quiz = await QuizModal.findOne({
        "examConfig.examCode": examCode,
        quizType: 'exam'
    });

    if (!quiz) {
        console.log("JoinExamService: Quiz not found for code:", examCode);
        throw new Error('Invalid_Exam_Code');
    }

    const examState = await examStateResolver(quiz);
    console.log(`JoinExamService: Code=${examCode}, State=${examState}, StartTime=${quiz.examConfig.startTime}`);

    if (examState == "completed") {
        throw new Error('Exam_Already_Ended');
    }

    const existingAttempt = await attemptmodal.findOne({
        quizID: quiz._id,
        userID
    })

    if (examState === 'live') {
        if (existingAttempt) {
            if (existingAttempt.endedAt) {
                throw new Error('Attempt_Already_Submitted');
            }
            return {
                attemptId: existingAttempt._id,
                quizID: quiz._id,
                Status: 'resume'

            };
        }
        return {
            quizID: quiz._id,
            Status: 'start'
        };
    }

    if (examState === 'upcoming') {
        return {
            Status: 'waiting',
            quizID: quiz._id,
            startTime: quiz.examConfig.startTime,
            endTime: quiz.examConfig.endTime,
        };


    };

}
module.exports = { joinExamService };