const AttemptModal = require("../../modals/attempt.modal");

const getAttemptStatusController = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const attempt = await AttemptModal.findById(attemptId);

        if (!attempt) return res.status(404).json({ message: "Attempt not found" });

        return res.status(200).json({
            endedAt: attempt.endedAt,
            status: attempt.endedAt ? 'completed' : 'active'
        });
    } catch (error) {
        return res.status(500).json({ message: "Error", error: error.message });
    }
};

module.exports = { getAttemptStatusController };
