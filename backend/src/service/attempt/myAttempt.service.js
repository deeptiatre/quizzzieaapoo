const attemptmodal = require("../../modals/attempt.modal")

const getMyAtteptService = async (userId) => {
    try {
        console.log("Service: Querying attempts for", userId);
        const results = await attemptmodal.find({ userID: userId })
            .populate('quizID', 'title discription quizType')
            .sort({ createdAt: -1 })
            .lean();
        console.log("Service: Found attempts:", results.length);
        return results;
    } catch (err) {
        console.error("Service Error in getMyAtteptService:", err);
        throw err;
    }
};
module.exports = {
    getMyAtteptService
}