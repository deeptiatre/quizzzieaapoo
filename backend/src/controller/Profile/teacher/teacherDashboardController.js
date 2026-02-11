const QuizModal = require("../../../modals/quiz.modal")

const teacherDashboardController = async (req, res) => {
    try {
        const { startDate, endDate, quizSearch, difficulty, studentName } = req.query;

        // Base Match Stage (Filters Quizzes)
        const matchStage = { createdby: req.user._id };

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
            matchStage.diffcultylevel = difficulty; // Note: Schema has typo 'diffcultylevel'
        }

        // 1. General Stats (Counts by Status)
        const stats = await QuizModal.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: "$quizStatus",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 2. Exam Performance (Average Score)
        // Ensure we only look at exams for this graph
        const examMatchStage = { ...matchStage, quizType: 'exam' };

        const performancePipeline = [
            { $match: examMatchStage },
            {
                $lookup: {
                    from: 'attempts',
                    localField: '_id',
                    foreignField: 'quizID',
                    as: 'attempts'
                }
            },
            { $unwind: { path: "$attempts", preserveNullAndEmptyArrays: false } }, // Only quizzes with attempts
            {
                $lookup: {
                    from: 'users',
                    localField: 'attempts.userID',
                    foreignField: '_id',
                    as: 'student'
                }
            },
            { $unwind: "$student" }
        ];

        // Filter by Student Name if provided
        if (studentName) {
            performancePipeline.push({
                $match: {
                    "student.name": { $regex: studentName, $options: 'i' }
                }
            });
        }

        performancePipeline.push(
            {
                $group: {
                    _id: "$_id",
                    title: { $first: "$title" },
                    averageScore: { $avg: "$attempts.score" }
                }
            }
        );

        const examPerformance = await QuizModal.aggregate(performancePipeline);

        res.status(200).json({ stats, examPerformance });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { teacherDashboardController };