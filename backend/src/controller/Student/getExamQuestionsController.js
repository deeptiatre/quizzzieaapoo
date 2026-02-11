const { getExamQuestionsService } = require("../../service/student/getExamQuestions");

const getExamQuestionsController = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const userID = req.user._id;

        const result = await getExamQuestionsService({
            attemptId,
            userID
        });

        return res.status(200).json({
            message: "Questions Fetched Successfully",
            // The frontend expects { questions: [], durationMinutes: ... } inside result
            // So we return result directly spread or as data?
            // Frontend: res.data.questions -> so structure should be { data: { questions: ... } } OR { questions: ... }
            // API standard here seems to be { data: result } or just result keys joined.
            // Let's look at ExamAttempt: res.data.questions
            // So if I return res.json(result), then res.data (axios) is the object. 
            // So res.data.questions work.
            ...result
        });

    } catch (error) {
        console.error("Error in getExamQuestionsController:", error);

        const errorMap = {
            'Attempt_Not_Found': [404, 'Exam attempt not found.'],
        }

        const [statusCode, message] = errorMap[error.message] || [500, 'Failed to fetch questions.'];

        return res.status(statusCode).json({
            message
        });
    }
}

module.exports = { getExamQuestionsController };
