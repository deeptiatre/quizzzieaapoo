const { startAttemptService } = require("../../service/student/startAttempt");

const startAttemptController = async (req,res) => {
    try {
        const {quizID} = req.body;
        const result = await startAttemptService({
            userID: req.user.id,
            quizID})
        
        return res.status(200).json({
            message: "Exam Attempt Started Successfully",
            data: result
        });

    } catch (error) {
        errorMap ={
            'Invalid_QuizExam' : [404, 'The specified quiz exam does not exist.'],
            'Exam_Not_Live' : [400, 'The exam is not currently live.'],
            'No_Questions_Found' : [404, 'No questions were found for this exam.'],
        }

        const [statusCode, message] = errorMap[error.message] || [500, 'An unexpected error occurred.'];

        return res.status(statusCode).json({
            message
        });
        
    }
}
module.exports = { startAttemptController };