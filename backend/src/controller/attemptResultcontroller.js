const attemptmodal = require("../modals/attempt.modal");


const attemptResultController = async (req, res) => {
    try {
        const { attemptId } = req.params;
        console.log(`[ResultDebug] Fetching result for: ${attemptId}`);

        const attempt = await attemptmodal
            .findById(attemptId)
            .populate({
                path: "answers.questionID",
                select: "questiontext options mark",

            });

        if (!attempt) {
            console.log(`[ResultDebug] Attempt ${attemptId} not found`);
            return res.status(404).json({
                message: "Attempt not found"
            });
        }

        if (attempt.userID.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to view this attempt"
            });
        }

        console.log(`[ResultDebug] Attempt Found. EndedAt: ${attempt.endedAt}`);

        if (!attempt.endedAt) {
            console.log(`[ResultDebug] Attempt not submitted yet.`);
            return res.status(400).json({
                message: "Quiz not yet submitted"
            });
        }

        return res.status(200).json({
            message: "Attempt result fetched successfully",

            attemptId: attempt._id,
            quizID: attempt.quizID,
            score: attempt.score,
            totalQuestions: attempt.questionIds?.length || 0,
            attempted: attempt.answers.length,
            correct: attempt.answers.filter(ans => ans.isCorrect).length,
            wrong: attempt.answers.filter(ans => !ans.isCorrect).length,
            submittedAt: attempt.endedAt,
            answers: attempt.answers.map(ans => {
                if (!ans.questionID) {
                    return {
                        questionId: "unknown",
                        question: "Question deleted",
                        options: [],
                        selectedOption: ans.selectedOption,
                        isCorrect: false,
                        mark: 0
                    };
                }
                return {
                    questionId: ans.questionID._id,
                    question: ans.questionID.questiontext,
                    options: ans.questionID.options,
                    selectedOption: ans.selectedOption,
                    isCorrect: ans.isCorrect,
                    mark: ans.questionID.mark,
                };
            }),


        });


    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message,
        })
    }
}

module.exports = { attemptResultController };