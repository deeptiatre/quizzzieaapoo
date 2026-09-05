const attemptmodal = require("../modals/attempt.modal");
const quizModal = require("../modals/quiz.modal");
const QuestionModal = require("../modals/question.modal");
const { finalizAttempt } = require("../service/grading/calcutlating.score.service");
const { submitAttemptService } = require("../service/attempt/submitAttemptService");

const submitQuizController = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers, submitReason } = req.body;


    const attempt = await submitAttemptService({
      attemptId,
      userId: req.user._id,
      answers,
      submitReason: submitReason === "time" ? "timeUp" : "manual",
      autoSubmitted: submitReason === "time"
    })

    return res.status(200).json({
      message: "Quiz submitted successfully",
      score: attempt.score,
      attemptId: attempt._id,
      totalQuestions: attempt.questionIds.length,
      attempted: attempt.answers.filter(ans => ans.selectedOption !== null).length,
      correct: attempt.answers.filter(ans => ans.isCorrect).length,
      wrong: attempt.answers.filter(ans => !ans.isCorrect).length,
    });


  } catch (error) {
    console.error("Error in submitQuizController:", error);

    if (error.message === 'Attempt_Already_Submitted') {
      console.log("Duplicate submission detected (handled gracefully).");
      try {
        const existingAttempt = await attemptmodal.findById(req.params.attemptId);
        return res.status(200).json({
          message: "Quiz already submitted",
          score: existingAttempt.score,
          attemptId: existingAttempt._id,
          totalQuestions: existingAttempt.questionIds?.length || 0,
          attempted: existingAttempt.answers?.filter(ans => ans.selectedOption !== null).length || 0,
          correct: existingAttempt.answers?.filter(ans => ans.isCorrect).length || 0,
          wrong: existingAttempt.answers?.filter(ans => !ans.isCorrect).length || 0,
        });
      } catch (innerError) {
        console.error("Error fetching existing attempt:", innerError);
      }
    }

    const errorMap = {
      'Invalid_Attempt': 404,
      'Unauthorized_Access': 403,
      'Associated_Quiz_Not_Found': 404,
      'Exam_Not_Live': 400,
    }

    const statusCode = errorMap[error.message] || 500;

    return res.status(statusCode).json({
      message: error.message || "internal server error",
      error: error.message,
    });
  }
}

const getAttemptQuestions = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await attemptmodal.findById(attemptId)
      .populate({
        path: "questionIds",
        select: "-options.iscorrect", // hide correct answers
      });

    if (!attempt) {
      return res.status(404).json({
        message: "Attempt not found",
      });
    }

    if (attempt.endedAt) {
      return res.status(400).json({
        message: "Quiz already submitted",
      });
    }

    const quiz = await quizModal.findById(attempt.quizID);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Calculate remaining time
    const durationMinutes = quiz.examConfig?.durationMinutes || quiz.timelimit;
    const durationSeconds = durationMinutes * 60;
    const elapsedSeconds = (Date.now() - new Date(attempt.startedAt).getTime()) / 1000;
    const remainingSeconds = Math.max(0, Math.floor(durationSeconds - elapsedSeconds));

    console.log(`[TimerDebug] Attempt: ${attemptId}`);
    console.log(`[TimerDebug] StartedAt: ${attempt.startedAt} (${new Date(attempt.startedAt).getTime()})`);
    console.log(`[TimerDebug] DurationMin: ${durationMinutes}, DurationSec: ${durationSeconds}`);
    console.log(`[TimerDebug] Elapsed: ${elapsedSeconds}, Remaining: ${remainingSeconds}`);

    // Map answers for frontend: { questionID: optionIndex }
    const answersMap = {};
    if (attempt.answers && attempt.answers.length > 0) {
      // We need to map selectedOption (string ID) back to index if frontend needs index,
      // BUT frontend handleAnswer uses optionIndex. 
      // Let's check how frontend uses it. 
      // Frontend: `selected={answers[q._id]}` passed to QuestionCard.
      // QuestionCard expects... let's assume it handles what we send.
      // Wait, frontend `handleAnswer` sets `optionIndex`. 
      // If DB stores `selectedOption` (string id) and `Attempt` stores that...
      // We might need to send the ID back if QuestionCard expects ID. 
      // Let's just send the raw answers array or map for now.
      // Actually, ExamAttempt line 30: setAnswers(res.data.answers).
      // Let's just send the map: questionID -> selectedOption (value).

      // Simpler: Just send the answers object as stored in DB?
      // Frontend uses `answers` state as object: { qId: value }.
      attempt.answers.forEach(a => {
        answersMap[a.questionID] = a.selectedOption;
      });
    }

    return res.status(200).json({
      quizId: attempt.quizID,
      questions: attempt.questionIds,
      remainingSeconds: remainingSeconds,
      answers: answersMap
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const violationController = async (req, res) => {
  try {

    const { attemptId } = req.params;

    const attempt = await attemptmodal.findById(attemptId);

    if (!attempt) {
      throw new Error('Invalid_Attempt');
    }

    const quiz = await quizModal.findById(attempt.quizID);

    attempt.tabSwitchCount += 1;
    await attempt.save();

    const maxSwitches = Number(quiz.examConfig?.maxTabSwitch ?? 3); // Default to 3 if missing

    if (attempt.tabSwitchCount >= maxSwitches) {
      const finalized = await submitAttemptService({
        attemptId,
        userId: attempt.userID,
        answers: attempt.answers,
        submitReason: "tabswitch",
        autoSubmitted: true
      })

      return res.status(200).json({
        message: "Attempt auto-submitted due to violation",
        attemptId: finalized._id,
        score: finalized.score,
      });
    }






    return res.status(200).json({
      message: "Warning recorded for tab switch",
      remainingTabSwitches: maxSwitches - attempt.tabSwitchCount
    });

  } catch (error) {
    console.error("Error in violationController:", error);
    const errorMap = {
      'Invalid_Attempt': [404, 'The specified attempt does not exist.'],
      'Unauthorized_Access': [403, 'You are not authorized to access this attempt.'],
      'Attempt_Already_Submitted': [400, 'This attempt has already been submitted.'],
      'Associated_Quiz_Not_Found': [404, 'The quiz associated with this attempt was not found.'],
    };

    const [statusCode, message] = errorMap[error.message] || [500, "Internal server error"];
    return res.status(statusCode).json({
      message: message,
      error: error.message
    });
  }
}

module.exports = { submitQuizController, getAttemptQuestions, violationController };