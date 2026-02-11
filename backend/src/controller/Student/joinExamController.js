const { joinExamService } = require("../../service/student/joinExamService");

const joinExamController = async (req, res) => {
    try {

        const { examCode } = req.body;
        const userID = req.user.id;

        // Normalize: Trim and Uppercase
        const cleanCode = examCode?.trim().toUpperCase();
        console.log("Attempting to join exam with code (raw):", examCode);
        console.log("Attempting to join exam with code (processed):", cleanCode);

        const result = await joinExamService({
            examCode: cleanCode,
            userID
        })
        return res.status(200).json({
            message: "Exam Join Status Fetched Successfully",
            data: result
        });

    } catch (error) {

        console.error("Error in joinExamController:", error);

        const errorMap = {
            'Invalid_Exam_Code': [404, 'The provided exam code is invalid.'],
            'Exam_Already_Ended': [400, 'The exam has already ended.'],
            'Attempt_Already_Submitted': [403, 'You have already submitted this exam.'],
        }

        const [statusCode, message] = errorMap[error.message] || [500, 'An unexpected error occurred.'];

        return res.status(statusCode).json({
            message
        });
    }
}
module.exports = { joinExamController };