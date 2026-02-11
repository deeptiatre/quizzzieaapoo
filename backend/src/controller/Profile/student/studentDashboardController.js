const attemptModal = require("../../../modals/attempt.modal");

const getStudentDashboardController = async (req, res) => {
  try {
    const userId = req.user._id;
    const statsAgg = await attemptModal.aggregate([
      { $match: { userID: userId } },

      {
        $addFields: {
          totalQuestions: {
            $size: { $ifNull: ["$questionIds", []] }
          },
          passMarks: {
            $ceil: {
              $divide: [
                { $size: { $ifNull: ["$questionIds", []] } },
                2
              ]
            }
          }
        }
      },

      {
        $addFields: {
          isPass: { $gte: ["$score", "$passMarks"] }
        }
      },

      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: "$score" },
          bestScore: { $max: "$score" },
          passCount: { $sum: { $cond: ["$isPass", 1, 0] } },
          failCount: { $sum: { $cond: ["$isPass", 0, 1] } }
        }
      }
    ]);

    const stats = statsAgg[0] || {
      totalAttempts: 0,
      averageScore: 0,
      bestScore: 0,
      passCount: 0,
      failCount: 0
    };


    const graphData = await attemptModal
      .find(
        { userID: userId },
        { score: 1, endedAt: 1 }
      )
      .sort({ endedAt: 1 })
      .lean();

    const formattedGraphData = graphData.map((item, index) => ({
      label: `Attempt ${index + 1}`,
      score: item.score,
      date: item.endedAt
    }));


    const recentAttemptsRaw = await attemptModal
      .find({ userID: userId })
      .sort({ endedAt: -1 })
      .limit(10)
      .lean();

    const recentAttempts = recentAttemptsRaw.map(item => ({
      score: item.score,
      date: item.endedAt,
      status: item.autoSubmitted ? "Auto Submitted" : "Submitted",
      reason: item.submitReason || "NORMAL",
      tabSwitchCount: item.tabSwitchCount || 0
    }));


    return res.status(200).json({
      totalAttempts: stats.totalAttempts,
      averageScore: Number(stats.averageScore?.toFixed(2)) || 0,
      bestScore: stats.bestScore,
      passCount: stats.passCount,
      failCount: stats.failCount,
      graphData: formattedGraphData,
      recentAttempts
    });

  } catch (error) {
    console.error("Student Dashboard Error:", error);
    return res.status(500).json({
      message: "Dashboard data fetch failed",
      error: error.message
    });
  }
};

module.exports = { getStudentDashboardController };
