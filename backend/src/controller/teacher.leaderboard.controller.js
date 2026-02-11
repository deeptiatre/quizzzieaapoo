const mongoose = require("mongoose");
const attemptmodal = require("../modals/attempt.modal");
const { leaderBoardService } = require("../service/leaderboard/leaderBoard.service");

const teacherLeaderBoardController = async (req, res) => {

    try {

        const { quizID } = req.params;
        console.log("teacherLeaderBoardController: Fetching for quizID:", quizID);

        const leaderBoard = await leaderBoardService(quizID);
        console.log("teacherLeaderBoardController: Found leaderboard entries:", leaderBoard.length);

        const stats = await attemptmodal.aggregate([
            { $match: { quizID: new mongoose.Types.ObjectId(quizID), endedAt: { $ne: null } } },//sirf sunmitted attemps
            {
                $group: {
                    _id: null,
                    totalAttempts: { $sum: 1 },
                    manualSubmissions: { $sum: { $cond: [{ $eq: ["$submitReason", "manual"] }, 1, 0] } },
                    timeUpSubmissions: { $sum: { $cond: [{ $eq: ["$submitReason", "timeUp"] }, 1, 0] } },
                    cheatinSubmissions: { $sum: { $cond: [{ $in: ["$submitReason", ["tabswitch", "copyPaste"]] }, 1, 0] } },

                }
            }]);
        return res.status(200).json({
            message: "Leaderboard fetched successfully",
            leaderBoard: leaderBoard,
            stats: stats[0] || { totalAttempts: 0, autoSubmitted: 0 }
        });

    } catch (error) {
        console.error("Teacher Leaderboard Error:", error);
        return res.status(500).json({
            message: "internal server error",
            error: error.message,
        });
    }
}
module.exports = { teacherLeaderBoardController };