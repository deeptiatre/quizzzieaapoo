const attemptmodal = require("../modals/attempt.modal");
const { leaderBoardService } = require("../service/leaderboard/leaderBoard.service");

const leaderBoardController = async (req, res) => {
  try {
    const { quizID } = req.params;
    const leaderBoard = await leaderBoardService(quizID);

    return res.status(200).json({
      message: "Leaderboard fetched successfully",
      leaderBoard: leaderBoard
    });

  } catch (error) {
    console.error("Error in leaderBoardController:", error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
}

module.exports = { leaderBoardController };