const { startAttemptService } = require("../../service/student/startAttempt");

const startAttemptController = async (req,res) => {
    try {
        const {quizID} = req.body;
        const result = await startAttemptService({
            userID: req.user._id || req.user.id,
            quizID
        });
        
        return res.status(200).json({
            message: "Exam Attempt Started Successfully",
            data: result
        });

    } catch (error) {
        console.error("Error in startAttemptController:", error);

        const errorMap = {
            'Invalid_QuizExam': [404, 'The specified quiz exam does not exist.'],
            'Exam_Not_Live': [400, 'The exam is not currently live.'],
            'No_Questions_Found': [404, 'No questions were found for this exam.'],
            'Attempt_Already_Submitted': [403, 'You have already submitted this exam.'],
            'Exam_Already_Ended': [400, 'The exam has already ended.'],
        };

        const [statusCode, message] = errorMap[error.message] || [500, error.message || 'An unexpected error occurred.'];

        return res.status(statusCode).json({
            message
        });
    }
}
module.exports = { startAttemptController };