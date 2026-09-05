const QuizModal = require("../modals/quiz.modal");
const attemptModal = require("../modals/attempt.modal");

const getQuizzesByTopicController = async (req, res) => {
    try {
        const { topic } = req.params;
        const userId = req.user._id;

        if (!topic) {
            return res.status(400).json({
                message: "Topic is required"
            });
        }

        // Case-insensitive search
        const quizzes = await QuizModal.find({
            topic: { $regex: new RegExp(`^${topic}$`, 'i') },
            quizStatus: { $in: ['live', 'completed', 'normal', 'upcoming'] },
            quizType: 'normal'
        }).select("-questions"); // Exclude questions for lighter response

        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({
                message: `No quizzes found for topic: ${topic}`,
                quizzes: []
            });
        }

        // Fetch attempts for these quizzes
        const quizIds = quizzes.map(q => q._id);
        const attempts = await attemptModal.find({
            userID: userId,
            quizID: { $in: quizIds }
        });

        const attemptMap = {};
        attempts.forEach(att => {
            attemptMap[att.quizID.toString()] = att;
        });

        const quizzesWithStatus = quizzes.map(quiz => {
            const attempt = attemptMap[quiz._id.toString()];
            return {
                ...quiz.toObject(),
                attempted: !!attempt,
                completed: attempt ? !!attempt.endedAt : false,
                attemptId: attempt ? attempt._id : null
            };
        });

        return res.status(200).json({
            message: "Quizzes fetched successfully",
            quizzes: quizzesWithStatus
        });

    } catch (error) {
        console.error("Error fetching quizzes by topic:", error);
        return res.status(500).json({
            message: "Failed to fetch quizzes by topic",
            error: error.message
        });
    }
};

module.exports = { getQuizzesByTopicController };
