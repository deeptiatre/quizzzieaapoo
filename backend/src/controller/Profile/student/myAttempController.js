const { getMyAtteptService } = require("../../../service/attempt/myAttempt.service")

const getMyAttemptController = async (req, res) => {
    try {
        console.log("Fetching attempts for user:", req.user._id);
        const attempts = await getMyAtteptService(req.user._id);
        console.log("Attempts fetched successfully, count:", attempts.length);
        return res.status(200).json({
            success: true,
            message: "User attempts fetched successfully",
            data: attempts
        });
    } catch (error) {
        console.error("CRITICAL ERROR in getMyAttemptController:", error);
        return res.status(500).json({
            success: false,
            message: "User attempts fetched failed",
            error: error.message
        })
    }


}

module.exports = { getMyAttemptController };