const QuizModal = require("../../../modals/quiz.modal")
const mongoose = require('mongoose');

const teachergetAllQuizzesContoller = async (req, res) => {
    try {
        console.log("Teacher fetching quizzes, User ID:", req.user._id);

        const { type, startDate, endDate, quizSearch, difficulty } = req.query;
        let matchStage = {
            createdby: new mongoose.Types.ObjectId(req.user._id)
        };

        console.log("DEBUG: Match Stage:", JSON.stringify(matchStage));

        if (type) {
            matchStage.quizType = type;
        }

        // Date Range Filter
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) matchStage.createdAt.$lte = new Date(endDate);
        }

        // Quiz Title Search
        if (quizSearch) {
            matchStage.title = { $regex: quizSearch, $options: 'i' };
        }

        // Difficulty Filter
        if (difficulty) {
            matchStage.diffcultylevel = difficulty;
        }

        const quizes = await QuizModal.aggregate([
            {
                $match: matchStage
            },
            {
                $lookup: {
                    from: "questions", // Ensure this matches your collection name (usually lowercase plural of model name)
                    localField: "_id",
                    foreignField: "quizID",
                    as: "questions"
                }
            },
            {
                $addFields: {
                    totalQuestions: { $size: "$questions" }
                }
            },
            {
                $project: {
                    questions: 0 // Remove the full questions array to keep response light
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        console.log("Quizzes found:", quizes.length);

        return res.status(200).json({
            message: "teacher quizess fetch sucessfully",
            quizes
        })

    } catch (error) {
        return res.status(500).json({
            message: "failed to fetch teacher quizes",
            error: error
        })
    }
}

module.exports = { teachergetAllQuizzesContoller }