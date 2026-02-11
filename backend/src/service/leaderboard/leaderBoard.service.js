const attemptmodal = require("../../modals/attempt.modal")

const leaderBoardService = async (quizId, limit = 50) => {
    console.log("leaderBoardService: Querying attempts for quizID:", quizId);
    const leaderBoard = await attemptmodal.find({
        quizID: quizId,
        endedAt: { $ne: null }
    })
        .populate('userID', 'name email')
        .sort({ score: -1, endedAt: 1, startedAt: 1 })
        .limit(limit)
        .lean();

    return leaderBoard
        .filter(attempt => attempt.userID) // Filter out attempts with deleted users
        .map((attempt, index) => ({
            rank: index + 1,
            userID: attempt.userID._id,
            name: attempt.userID.name,
            score: attempt.score,
            submittedAt: attempt.endedAt,
            autoSubmitted: attempt.autoSubmitted
        }));

}
module.exports = { leaderBoardService };