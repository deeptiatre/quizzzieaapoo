const attemptModal = require("../modals/attempt.modal");
const QuestionModal = require("../modals/question.modal");
const QuizModal = require("../modals/quiz.modal");
const examCompletionJob = require("../service/exam/jobEamCompletion.service");

// --------------------------------------------------
// 1️⃣ GET ALL QUIZZES (Normal & Live Only)
// --------------------------------------------------
const getAllQuizesController = async (req, res) => {
    try {
        await examCompletionJob();
        const userId = req.user._id;

        // 1. Fetch all normal & live quizzes
        // 1. Fetch all live quizzes (normal & exam)
        // 1. Fetch all live, completed, normal AND UPCOMING quizzes
        const quizzes = await QuizModal.find({
            quizStatus: { $in: ['live', 'completed', 'normal', 'upcoming'] }
        }).select("title discription timelimit totalmarks diffcultylevel topic questions quizType quizStatus endTime startTime");

        // 2. Fetch attempts by this user for these quizzes
        const quizIds = quizzes.map(q => q._id);
        const attempts = await attemptModal.find({
            userID: userId,
            quizID: { $in: quizIds }
        });

        // 3. Create a map of attempts for quick lookup
        const attemptMap = {};
        attempts.forEach(att => {
            attemptMap[att.quizID.toString()] = att;
        });

        // 4. Attach status and Calculate Rank
        const quizzesWithStatus = await Promise.all(quizzes.map(async (quiz) => {
            const attempt = attemptMap[quiz._id.toString()];
            let rank = "Not Attempted";

            // Determine dynamic status
            let dynamicStatus = quiz.quizStatus;
            const now = Date.now();

            if (quiz.quizType === 'exam') {
                if (quiz.endTime && now > new Date(quiz.endTime).getTime()) {
                    dynamicStatus = 'completed';
                } else if (quiz.startTime && now >= new Date(quiz.startTime).getTime() && quiz.quizStatus === 'upcoming') {
                    dynamicStatus = 'live';
                }
            }


            if (attempt) {
                // Calculate Rank: Count how many attempts for this quiz have a higher score
                const higherScores = await attemptModal.countDocuments({
                    quizID: quiz._id,
                    score: { $gt: attempt.score }
                });
                rank = higherScores + 1;
            }

            return {
                ...quiz.toObject(),
                quizStatus: dynamicStatus, // Use calculated status
                attempted: !!attempt,
                completed: attempt ? !!attempt.endedAt : false,
                attemptId: attempt ? attempt._id : null,
                myRank: rank
            };
        }));

        return res.status(200).json({
            message: "quizzes fetched successfully",
            quizes: quizzesWithStatus,
        });
    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message,
        });
    }
};

// --------------------------------------------------
// 2️⃣ GET QUIZZES BY DIFFICULTY
// --------------------------------------------------
const getQuizBydifficultyController = async (req, res) => {
    try {
        const { level } = req.params;

        // ✔ use same schema field: diffcultylevel
        const quizes = await QuizModal.find({ diffcultylevel: level });

        return res.status(200).json({
            message: `quizzes with difficulty ${level} fetched successfully`,
            quizes,
        });
    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message,
        });
    }
};


// --------------------------------------------------
// 4️⃣ START QUIZ (CREATE ATTEMPT)
// --------------------------------------------------
const StartQuizController = async (req, res) => {
    try {
        const { quizID } = req.params;

        let questions = await QuestionModal.find({ quizID }).select("_id");

        if (questions.length === 0) {
            return res.status(404).json({
                message: "No questions found for this quiz",
            });
        }

        questions = questions.sort(() => Math.random() - 0.5);
        const questionIds = questions.map((question) => question._id);

        const existingAttempt = await attemptModal.findOne({
            userID: req.user._id,
            quizID: quizID
        });

        if (existingAttempt) {
            if (!existingAttempt.endedAt) {
                // Resume ongoing attempt
                return res.status(400).json({
                    message: "You already started this quiz",
                    attemptId: existingAttempt._id,
                });
            }

            // Re-take: Reset previous completed attempt
            existingAttempt.questionIds = questionIds;
            existingAttempt.startedAt = Date.now();
            existingAttempt.endedAt = null;
            existingAttempt.score = 0;
            existingAttempt.answers = [];
            existingAttempt.tabSwitchCount = 0;
            existingAttempt.autoSubmitted = false;
            existingAttempt.submitReason = "manual";
            await existingAttempt.save();

            return res.status(200).json({
                message: "quiz restarted successfully",
                attemptId: existingAttempt._id,
            });
        }

        const newAttempt = await attemptModal.create({
            userID: req.user._id,
            quizID,
            questionIds: questionIds,
            startedAt: Date.now(),
        });

        return res.status(200).json({
            message: "quiz started successfully",
            attemptId: newAttempt._id,
        });
    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message,
        });
    }
};

module.exports = {
    getAllQuizesController,
    getQuizBydifficultyController,

    StartQuizController,
};
