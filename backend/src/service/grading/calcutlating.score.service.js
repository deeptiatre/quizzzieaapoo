const QuestionModal = require("../../modals/question.modal");

const finalizAttempt = async ({
    attempt,
    answers = [],
    submitReason = "manual",
    autoSubmitted = false
}) => {

    if (attempt.endedAt) {
        throw new Error("Attempt already submitted");
    };

    const questions = await QuestionModal.find({
        _id: { $in: attempt.questionIds }
    });

    let score = 0;
    let evaluatedAnswers = [];

    for (let question of questions) {

        const studentrAnswer = answers.find(
            ans => ans.questionID.toString() === question._id.toString()
        );

        const correctOption = question.options.find(option => option.iscorrect);

        console.log(`[ScoreDebug] Q: ${question.questiontext}`);
        console.log(`[ScoreDebug] Correct Option ID: ${correctOption?._id}`);
        console.log(`[ScoreDebug] Student Answer Option: ${studentrAnswer?.selectedOption}`);

        let isCorrect = false;

        if (studentrAnswer && correctOption) {
            // Compare IDs
            if (studentrAnswer.selectedOption && correctOption._id.toString() === studentrAnswer.selectedOption.toString()) {
                isCorrect = true;
                score += question.mark;
                console.log(`[ScoreDebug] Correct! (+${question.mark})`);
            } else {
                console.log(`[ScoreDebug] Wrong/Mismatch`);
            }
        }

        evaluatedAnswers.push({
            questionID: question._id,
            selectedOption: studentrAnswer ? studentrAnswer.selectedOption : null,
            isCorrect: isCorrect
        });
    }


    attempt.score = score;
    attempt.answers = evaluatedAnswers;
    attempt.endedAt = Date.now();
    attempt.submitReason = submitReason;
    attempt.autoSubmitted = autoSubmitted;

    await attempt.save();
    return attempt;

};

module.exports = {
    finalizAttempt
};