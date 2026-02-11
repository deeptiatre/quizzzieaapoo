const QuizModal = require("../modals/quiz.modal");
const AttemptModal = require("../modals/attempt.modal");

// --------------------------------------------------
// 🛑 DELETE QUIZ
// --------------------------------------------------
const deleteQuizController = async (req, res) => {
    try {
        const { quizID } = req.params;
        const quiz = await QuizModal.findById(quizID);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (quiz.createdby.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: You are not the creator" });
        }

        // Optional: Block delete if live? User said "force delete" option for live exams.
        // But usually "delete" is distinct. The user asked for "delete quiz option" AND "force end option".
        // Let's allow delete for any status for simplicity, or warn? 
        // User said: "har quiz ke samne delete quiz ka option... or jo exam mode me hai unke samne force delete (force end) ka option"
        // Interpreting: 
        // 1. General Delete: Removes quiz entirely from DB.
        // 2. Force End: Specifically for LIVE exams -> Changes status to COMPLETED and ends all attempts.

        await QuizModal.findByIdAndDelete(quizID);
        // Clean up attempts?
        await AttemptModal.deleteMany({ quizID });

        return res.status(200).json({ message: "Quiz deleted successfully" });

    } catch (error) {
        console.error("Delete Quiz Error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// --------------------------------------------------
// 🛑 FORCE END EXAM
// --------------------------------------------------
const forceEndExamController = async (req, res) => {
    try {
        const { quizID } = req.params;
        const quiz = await QuizModal.findById(quizID);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (quiz.createdby.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (quiz.quizStatus !== 'live') {
            return res.status(400).json({ message: "Quiz is not currently live" });
        }

        // 1. Update Quiz Status
        quiz.quizStatus = 'completed';
        // check if has endTime, maybe set it to now?
        if (quiz.examConfig && quiz.examConfig.endTime) {
            quiz.examConfig.endTime = new Date();
        }
        await quiz.save();

        // 2. Auto-submit all ongoing attempts
        // Find attempts where endedAt is null
        const activeAttempts = await AttemptModal.find({ quizID, endedAt: null });

        const now = new Date();
        const bulkOps = activeAttempts.map(attempt => ({
            updateOne: {
                filter: { _id: attempt._id },
                update: {
                    $set: {
                        endedAt: now,
                        submitReason: 'FORCE_END'
                    }
                }
            }
        }));

        if (bulkOps.length > 0) {
            await AttemptModal.bulkWrite(bulkOps);
        }

        return res.status(200).json({
            message: "Exam force-ended successfully. Students will be redirected.",
            affectedAttempts: activeAttempts.length
        });

    } catch (error) {
        console.error("Force End Error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = { deleteQuizController, forceEndExamController };
