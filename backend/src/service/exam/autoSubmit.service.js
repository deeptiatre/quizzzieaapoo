const attemptmodal = require("../../modals/attempt.modal");
const { finalizAttempt } = require("../grading/calcutlating.score.service");

const autoSubmitService = async (quizID) => {

    const pendingAttemps = await attemptmodal.find({
        quizID: quizID,
        endedAt: null,
    });

    for (const attempt of pendingAttemps) {
        await finalizAttempt({
            attempt,
            answers: attempt.answers,
            submitReason: "timeup",
            autoSubmitted: true
        })
    }
    return pendingAttemps.length;
}

module.exports = { autoSubmitService };