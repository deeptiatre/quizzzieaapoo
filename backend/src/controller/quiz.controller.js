const attemptmodal = require("../modals/attempt.modal");
const QuestionModal = require("../modals/question.modal");
const QuizModal = require("../modals/quiz.modal");
const enableExamService = require("../service/exam/examEnable.service");

const CreateQuizController = async (req, res) => {
  try {
    let { title, discription, timelimit, totalmarks, diffcultylevel, topic, quizStatus, quizType } = req.body;
    if (!title || !discription || timelimit === undefined || timelimit === null || !topic) {
      console.log(title, discription, timelimit, totalmarks);
      return res.status(400).json({

        message: "All fields are required"
      })

    }

    // Default to 'draft' and 'normal' if not provided
    quizStatus = quizStatus || 'draft';
    quizType = quizType || 'normal';

    const quiz = await QuizModal.create({
      title,
      discription,
      timelimit,
      totalmarks,
      diffcultylevel,
      diffcultylevel, // Kept as per original strict replacement, though redundant
      topic,
      quizStatus, // Allow setting status directly
      quizType,
      createdby: req.user._id
    })

    return res.status(201).json({
      message: "Quiz created successfully",
      quiz: quiz
    })

  } catch (error) {
    console.error("Error in CreateQuizController:", error);
    return res.status(500).json({
      message: "internal server error ",
      error: error.message
    })
  }
}


const addquestionController = async (req, res) => {
  try {
    let { quizID } = req.params;
    let { questiontext, mark, options } = req.body;

    if (!questiontext || !mark || !options || options.length < 2) {
      console.log(questiontext, mark, options);
      return res.status(400).json({
        message: "All fields are required and options should be at least 2"
      })
    }
    const correctOptions = options.filter(option => option.iscorrect === true);
    if (correctOptions.length === 0) {
      return res.status(400).json({
        message: "At least one option should be correct"
      })
    }
    const quiz = await QuizModal.findById(quizID);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const question = await QuestionModal.create({
      quizID,
      questiontext,
      mark,
      options
    });

    quiz.totalmarks += mark;
    await quiz.save();
    return res.status(201).json({
      message: "Question added successfully",
      question: question
    })

  } catch (error) {
    console.error("Error in addquestionController:", error);
    return res.status(500).json({
      message: "internal server error ",
      error: error.message
    })
  }

}

const updateQuestionController = async (req, res) => {
  try {
    const { questionID } = req.params;
    const { questiontext, mark, options } = req.body;

    const question = await QuestionModal.findById(questionID);
    if (!question) {
      return res.status(404).json({
        message: "Question not found"
      })
    }

    const quiz = await QuizModal.findById(question.quizID);
    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      })
    }

    if (quiz.createdby.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this question"
      })
    }

    if (quiz.quizStatus !== 'draft') {
      return res.status(400).json({
        message: "Cannot update question as exam is schedule or live"
      })
    }

    if (options) {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          message: "At least two options are required"
        })
      }

      const correctOptions = options.filter(option => option.iscorrect === true);
      if (correctOptions.length === 0) {
        return res.status(400).json({
          message: "At least one option should be correct"
        })
      }
    }
    if (mark && mark !== question.mark) {
      quiz.totalmarks = quiz.totalmarks - question.mark + mark;
      await quiz.save();
    }

    question.questiontext = questiontext ?? question.questiontext;
    question.mark = mark ?? question.mark;
    question.options = options ?? question.options;

    await question.save();

    return res.status(200).json({
      message: "Question updated successfully",
      question: question
    })

  } catch (error) {
    return res.status(500).json({
      message: "internal server error ",
      error: error.message
    })
  }
}

const deleteQuestionContoller = async (req, res) => {
  try {
    const { questionID } = req.params;
    const question = await QuestionModal.findById(questionID);
    if (!question) {
      return res.status(404).json({
        message: "Question not found"
      })
    }
    const quiz = await QuizModal.findById(question.quizID);
    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      })
    }

    if (quiz.createdby.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this question"
      })
    }
    if (quiz.quizStatus !== 'draft') {
      return res.status(400).json({
        message: "Cannot delete question as exam is schedule or live"
      })
    }

    quiz.totalmarks -= question.mark;
    if (quiz.totalmarks < 0) quiz.totalmarks = 0;
    await quiz.save();

    await QuestionModal.findByIdAndDelete(questionID)
    return res.status(200).json({
      message: "Question deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "internal server error ",
      error: error.message
    })
  }
}

const enableExamController = async (req, res) => {
  try {

    const result = await enableExamService({
      quizID: req.params.quizID,
      examConfig: req.body,
      userID: req.user._id
    })

    return res.status(200).json({
      message: "Exam mode enabled successfully",
      ...result
    })

  } catch (error) {
    const errorMap = {
      QUIZ_NOT_FOUND: [404, "Quiz not found"],
      NOT_AUTHORIZED: [403, "Unauthorized: You are not the creator of this quiz"],
      INVALID_QUIZ_STATE: [404, "Quiz must be in draft and normal state to enable exam mode"],
      NO_QUESTIONS: [404, "At least 2 questions are required to enable exam mode"],
      INVALID_TIME: [404, "Invalid start time or end time"],
      DURATION_MISMATCH: [404, "Duration does not match the difference between start time and end time"],
      DURATION_EXCEEDS_WINDOW: [400, "Exam duration cannot be longer than the start/end time window"],


    };
    const [statusCode, message] = errorMap[error.message] || [500, "Internal server error"];
    return res.status(statusCode).json({
      message: message
    });
  }
}


const getQuizByIdController = async (req, res) => {
  try {
    const { quizID } = req.params;
    const quiz = await QuizModal.findById(quizID);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questions = await QuestionModal.find({ quizID });

    return res.status(200).json({
      message: "Quiz fetched successfully",
      quiz: {
        ...quiz.toObject(),
        questions: questions
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
      error: error.message
    });
  }
}


module.exports = {
  CreateQuizController,
  addquestionController,
  updateQuestionController,
  deleteQuestionContoller,
  enableExamController,
  getQuizByIdController
};