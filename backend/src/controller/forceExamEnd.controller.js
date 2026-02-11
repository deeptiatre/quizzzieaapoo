const { ensureEamCompletion } = require("../service/exam/examCompletion.service");

const forceExamEnsController = async (req, res) => {
    try {
        const { quizID } = req.params;
        await ensureEamCompletion(quizID);

        return res.status(200).json({
            message: "Exam ended forcefully for all participants successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message,
        });
    }
}
module.exports = { forceExamEnsController };